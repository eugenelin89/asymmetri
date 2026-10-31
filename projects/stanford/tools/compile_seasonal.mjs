// SPDX-License-Identifier: MIT
// Rebuild deterministic, collision-checked Stanford placement and navigation data.
// Run from any directory with Node 24: node projects/stanford/tools/compile_seasonal.mjs
import '../test-loader.mjs';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, renameSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const campusRoot = new URL('../', import.meta.url);
const sourceRoot = new URL('../../public/stanford/v0.1-2026-10-31/', campusRoot);
const sha256 = value => createHash('sha256').update(value).digest('hex');
const dataBytes = readFileSync(new URL('data.json', sourceRoot));
const anchorBytes = readFileSync(new URL('anchors.json', sourceRoot));
const peopleBytes = readFileSync(new URL('data/people.json', campusRoot));
const data = JSON.parse(dataBytes), rawAnchors = JSON.parse(anchorBytes);
const modelFiles = ['architecture.ts','builder.ts','footprint-context.ts','outdoor.ts','layout.ts','spatial.ts','residence-controls.ts','residence-layout.ts','doors.ts'];
const modelInputs = Object.fromEntries(modelFiles.map(path => [path, sha256(readFileSync(new URL(path,campusRoot)))]));
const { buildArchitecture, architectureEnvelope, usesFootprintContext } = await import('../architecture.ts');
const { buildFootprintContext } = await import('../footprint-context.ts');
const { createOutdoor, outdoorIds } = await import('../outdoor.ts');
const { createCollision, createRoutes, global } = await import('../spatial.ts');
const { landmarkIds, applyCampusAnchors } = await import('../layout.ts');
const { createResidenceControls } = await import('../residence-controls.ts');
const { createHalloween, halloweenMonsterKinds } = await import('../halloween.ts');
const { createPeople } = await import('../people.ts');
const { characters } = await import('../registry.ts');
const anchors = applyCampusAnchors(rawAnchors);
const interiors = [];
const excluded = new Set(outdoorIds.flatMap(id => anchors[id]?.buildingId ? [anchors[id].buildingId] : []));
console.time('Build complete campus collision');
for (const id of landmarkIds) {
  const anchor = anchors[id] = architectureEnvelope(id,anchors[id]);
  const source = data.buildings.find(building => building.id === anchor.buildingId);
  const asset = buildArchitecture(id,anchor.width,anchor.depth,source?.height);
  const residence = id === 'branner' ? createResidenceControls(asset) : undefined;
  if (anchor.buildingId) excluded.add(anchor.buildingId);
  anchor.connectedBuildingIds?.forEach(buildingId => excluded.add(buildingId));
  interiors.push({anchor,colliders:asset.colliders,floors:asset.floors,ramps:asset.ramps,entry:asset.entry,dynamicBlocked:residence?.dynamicBlocked});
  const context = source && usesFootprintContext(id)
    ? buildFootprintContext(source,anchor,id === 'main-quad' ? data.buildings.filter(building => building.id === anchors['memorial-church'].buildingId) : [])
    : null;
  if (context) { interiors.push(context.interior); asset.entry = context.entry; }
  anchor.entry = global(asset.entry,anchor);
}
const outdoor = createOutdoor(anchors);
interiors.push(...outdoor.interiors);
const collision = createCollision(data,interiors,excluded);
console.timeEnd('Build complete campus collision');
const commonProvenance = {
  schemaVersion: 1,
  generator: 'projects/stanford/tools/compile_seasonal.mjs',
  generatorSha256: sha256(readFileSync(new URL(import.meta.url))),
  command: 'node projects/stanford/tools/compile_seasonal.mjs',
  node: process.version,
  generatedAt: new Date().toISOString(),
  sources: {
    data: {path:'public/stanford/v0.1-2026-10-31/data.json',sha256:sha256(dataBytes)},
    anchors: {path:'public/stanford/v0.1-2026-10-31/anchors.json',sha256:sha256(anchorBytes)},
    people: {path:'projects/stanford/data/people.json',sha256:sha256(peopleBytes)},
  },
  modelInputs,
  collisionSetup: 'Complete source campus plus all landmark interiors, source footprint contexts, Main Quad church exclusion, connected Burnham entrance-wing exclusion, all outdoor venues, and closed Branner doors with lift at lobby.',
  placement: 'Deterministic original gameplay placements. Source routes and collision clearances are compiled; no movement updates are applied before serialization.',
};
function unchangedSources() {
  assert.equal(sha256(readFileSync(new URL('data.json', sourceRoot))),sha256(dataBytes),'Source geography changed during compilation');
  assert.equal(sha256(readFileSync(new URL('anchors.json', sourceRoot))),sha256(anchorBytes),'Source anchors changed during compilation');
  for (const [path,hash] of Object.entries(modelInputs)) assert.equal(sha256(readFileSync(new URL(path,campusRoot))),hash,`Model source changed during compilation: ${path}`);
}
function writeAsset(name,value) {
  unchangedSources();
  const directory = new URL('data/',campusRoot); mkdirSync(directory,{recursive:true});
  const target = new URL(name,directory), temporary = new URL(`${name}.tmp`,directory);
  const bytes = JSON.stringify(value) + '\n';
  writeFileSync(temporary,bytes); renameSync(temporary,target);
  console.log(`Wrote projects/stanford/data/${name} · ${Buffer.byteLength(bytes)} bytes`);
}
console.time('Compile Halloween clearance');
// Explicit false bypasses runtime caches after they are wired in by the engine.
const seasonal = createHalloween(data,anchors,interiors,collision.blocked,false);
console.timeEnd('Compile Halloween clearance');
assert(seasonal.monsters.length >= 150);
assert.equal(new Set(seasonal.monsters.map(monster => monster.kind)).size,halloweenMonsterKinds.length);
writeAsset('seasonal-layout.json',{
  decorations:seasonal.decorations,gatewayPumpkins:seasonal.gatewayPumpkins,monsters:seasonal.monsters,
  provenance:{...commonProvenance,algorithm:'createHalloween',algorithmSha256:sha256(createHalloween.toString()),counts:{decorations:seasonal.decorations.length,gatewayPumpkins:seasonal.gatewayPumpkins.length,monsters:seasonal.monsters.length,monsterKinds:halloweenMonsterKinds.length}},
});
console.time('Compile named people routes');
const people = createPeople(data,anchors,collision.blocked,false), routes = people.routes();
console.timeEnd('Compile named people routes');
const missing = characters.filter(character => !routes[character.id]?.length).map(character => character.id);
assert.deepEqual(missing,[],'Every registered character needs a route');
writeAsset('people-routes.json',{
  routes,provenance:{...commonProvenance,algorithm:'createPeople.networkRoute',algorithmSha256:sha256(createPeople.toString()),counts:{characters:characters.length,routes:Object.keys(routes).length},coverage:people.coverage()},
});
console.time('Compile walking navigation graph');
const navigation = createRoutes(data,collision.blocked);
console.timeEnd('Compile walking navigation graph');
assert(navigation.edges instanceof Map,'createRoutes must expose its edge map');
writeAsset('navigation-graph.json',{
  nodes:navigation.nodes,edges:[...navigation.edges],
  provenance:{...commonProvenance,algorithm:'createRoutes',algorithmSha256:sha256(createRoutes.toString()),counts:{nodes:navigation.nodes.length,adjacencyLists:navigation.edges.size,directedEdges:[...navigation.edges.values()].reduce((sum,edges) => sum+edges.length,0)}},
});
console.log('Stanford seasonal, people, and navigation caches compiled successfully.');
