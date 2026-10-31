import * as THREE from "three";
import type { CampusData, Point } from "./types";
import { batchStatic, box, lettering, material, sphere } from "./props";
export function pathLength(points: Point[]) {
  return points
    .slice(1)
    .reduce(
      (sum, p, i) => sum + Math.hypot(p[0] - points[i][0], p[1] - points[i][1]),
      0,
    );
}
export function alongPath(points: Point[], distance: number, offset = 0) {
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1],
      b = points[i],
      dx = b[0] - a[0],
      dz = b[1] - a[1],
      length = Math.hypot(dx, dz);
    if (!length) continue;
    if (distance <= length || i === points.length - 1) {
      const t = Math.min(1, distance / length);
      return {
        x: a[0] + dx * t + (dz / length) * offset,
        z: a[1] + dz * t - (dx / length) * offset,
        yaw: Math.atan2(dx, dz),
      };
    }
    distance -= length;
  }
  return { x: points[0][0], z: points[0][1], yaw: 0 };
}
export function vehicle(
  bus: boolean,
  index: number,
  number = "",
  destination = "",
) {
  const g = new THREE.Group(),
    paint = material(
      bus
        ? 0x8c1515
        : [0xbbbdbb, 0x49627b, 0x883e3b, 0xd5d2c4, 0x303b40][index % 5],
      0.28,
      0.55,
    ),
    silver = material(0xc0c5c6, 0.35, 0.6),
    black = material(0x1c2429, 0.65),
    gold = material(0xf1d13b),
    glass = new THREE.MeshStandardMaterial({
      color: 0x648d9c,
      roughness: 0.12,
      metalness: 0.2,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    }),
    light = new THREE.MeshStandardMaterial({
      color: 0xfff2d2,
      emissive: 0xffedc3,
      emissiveIntensity: 1.6,
    }),
    red = new THREE.MeshStandardMaterial({
      color: 0xa62426,
      emissive: 0x912025,
      emissiveIntensity: 0.6,
    });
  const length = bus ? 12.2 : 4.55,
    width = bus ? 2.5 : 1.82,
    wheels: THREE.Mesh[] = [],
    passengers = new THREE.Group();
  box(g, paint, 0, bus ? 0.7 : 0.62, 0, width, bus ? 0.95 : 0.65, length);
  if (bus) {
    box(g, silver, 0, 2.92, 0, width, 0.3, length - 0.12);
    box(g, silver, 0, 3.13, -2.8, 1.85, 0.2, 3.9);
    box(g, black, 0, 1.9, -length / 2 + 0.13, width, 1.65, 0.23);
    box(g, glass, 0, 1.9, length / 2 - 0.08, width - 0.16, 1.6, 0.08);
    box(g, black, 0, 2.6, length / 2 - 0.02, width, 0.4, 0.08);
    for (const side of [-1, 1]) {
      box(g, gold, side * (width / 2 + 0.01), 1.22, 0, 0.025, 0.065, length);
      box(g, silver, side * (width / 2 + 0.015), 0.69, -2.3, 0.025, 0.87, 7.5);
      box(
        g,
        glass,
        side * (width / 2 + 0.02),
        1.99,
        0,
        0.035,
        1.4,
        length - 0.4,
      );
      for (let z = -5.5; z < 6; z += 1.17)
        box(g, black, side * (width / 2 + 0.04), 1.99, z, 0.08, 1.55, 0.085);
      box(
        g,
        black,
        side * (width / 2 + 0.025),
        2.75,
        0,
        0.06,
        0.12,
        length - 0.3,
      );
      box(
        g,
        black,
        side * (width / 2 + 0.02),
        1.3,
        0,
        0.05,
        0.08,
        length - 0.3,
      );
      box(g, black, side * (width / 2 + 0.22), 2.08, 5.6, 0.2, 0.4, 0.17);
    }
    for (const z of [4.75, -0.85]) {
      box(g, black, 1.275, 1.45, z, 0.06, 2.05, 1.1);
      box(g, glass, 1.32, 1.55, z, 0.025, 1.75, 0.95);
      box(g, silver, 1.34, 1.5, z, 0.025, 1.95, 0.035);
    }
    const sign = lettering(
      `${number} ${destination
        .replace(/^\d+\s*/, "")
        .split("/To ")
        .at(-1)
        ?.toUpperCase()}`,
      2.22,
      0.3,
    );
    sign.position.set(0, 2.6, 6.13);
    g.add(sign);
    const rear = lettering(number, 0.55, 0.3);
    rear.position.set(0.7, 2.48, -6.13);
    rear.rotation.y = Math.PI;
    g.add(rear);
    for (let row = 0; row < 7; row++)
      for (const side of [-1, 1]) {
        const z = -4.7 + row * 1.1,
          x = side * 0.77;
        box(g, paint, x, 0.98, z, 0.58, 0.12, 0.65);
        box(g, paint, x, 1.29, z - 0.25, 0.58, 0.65, 0.12);
        const skin = material(
            [0xd0a17a, 0x8a5d3f, 0x5c3b2b, 0xe3bd9c][(row + side + 1) % 4],
          ),
          shirt = material([0x69566e, 0x47766d, 0xb29052, 0x667d91][row % 4]);
        box(passengers, shirt, x, 1.38, z, 0.4, 0.57, 0.27);
        sphere(passengers, skin, x, 1.84, z, 0.145);
        box(passengers, black, x, 1.02, z + 0.23, 0.39, 0.16, 0.45);
        box(g, gold, side * 0.3, 1.65, z, 0.028, 1.65, 0.028);
      }
    // Driver is a fictional adult; passenger meshes represent anonymous students.
    box(passengers, paint, -0.73, 1.42, 5, 0.42, 0.6, 0.28);
    sphere(passengers, material(0xb88762), -0.73, 1.88, 5, 0.15);
    g.add(passengers);
  } else {
    box(g, glass, 0, 1.17, -0.1, 1.55, 0.7, 2.25);
    box(g, paint, 0, 1.54, -0.19, 1.52, 0.12, 1.9);
    for (const side of [-1, 1]) {
      box(g, paint, side * 0.79, 1.2, -0.12, 0.085, 0.62, 0.12);
      box(g, paint, side * 0.97, 1.12, 0.9, 0.24, 0.12, 0.25);
      box(g, silver, side * 0.92, 0.83, -0.45, 0.02, 0.035, 0.19);
    }
    for (const z of [-0.65, 0.48])
      for (const x of [-0.42, 0.42]) box(g, black, x, 0.95, z, 0.48, 0.5, 0.35);
  }
  for (const z of [-(bus ? 3.8 : 1.42), bus ? 3.8 : 1.42])
    for (const side of [-1, 1]) {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(
          bus ? 0.5 : 0.31,
          bus ? 0.5 : 0.31,
          0.24,
          20,
        ),
        black,
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set((side * width) / 2, bus ? 0.5 : 0.33, z);
      g.add(wheel);
      wheels.push(wheel);
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(
          bus ? 0.29 : 0.19,
          bus ? 0.29 : 0.19,
          0.25,
          12,
        ),
        silver,
      );
      hub.rotation.z = Math.PI / 2;
      hub.position.copy(wheel.position);
      g.add(hub);
    }
  for (const side of [-1, 1]) {
    box(
      g,
      light,
      side * width * 0.34,
      0.82,
      length / 2 + 0.035,
      bus ? 0.26 : 0.4,
      0.14,
      0.04,
    );
    box(g, red, side * width * 0.37, 0.8, -length / 2 - 0.035, 0.2, 0.22, 0.04);
  }
  box(g, black, 0, 0.3, length / 2 + 0.06, width * 0.95, 0.14, 0.13);
  box(g, black, 0, 0.3, -length / 2 - 0.06, width * 0.95, 0.14, 0.13);
  batchStatic(passengers);
  batchStatic(g, new Set(wheels));
  return { group: g, wheels, passengers, length };
}
export function createTraffic(data: CampusData) {
  const group = new THREE.Group(),
    actors: {
      model: ReturnType<typeof vehicle>;
      points: Point[];
      distance: number;
      length: number;
      speed: number;
      bus: boolean;
      offset: number;
    }[] = [];
  const add = (
    points: Point[],
    bus: boolean,
    index: number,
    number = "",
    destination = "",
  ) => {
    const length = pathLength(points);
    if (length < 35) return;
    const model = vehicle(bus, index, number, destination);
    group.add(model.group);
    actors.push({
      model,
      points,
      distance: ((index * 0.381) % 1) * length,
      length,
      speed: bus ? 7 : 6.5 + (index % 4),
      bus,
      offset: bus ? 0 : 1.65,
    });
  };
  // Simulated vehicles stay on mapped motor roads, never pedestrian malls.
  const roads=(data.roads||[]).filter(r=>["Campus Drive","Campus Drive East","Campus Drive West","Palm Drive","Galvez Street","Arboretum Road"].includes(r.name)&&pathLength(r.points)>55).sort((a,b)=>pathLength(b.points)-pathLength(a.points)).slice(0,28);
  for(const road of roads) {
    add(road.points,false,actors.length);
    if(pathLength(road.points)>160)add([...road.points].reverse(),false,actors.length);
  }
  // Generic campus shuttles use source-road geometry. No timetable is implied.
  roads.filter(r=>r.name.includes("Campus Drive")&&pathLength(r.points)>160).slice(0,4).forEach((r,i)=>add(r.points,true,i,"CAMPUS","SIMULATED SHUTTLE"));
  function update(
    dt: number,
    focus: Point,
    hour: number,
    enabled: boolean,
    reduced: boolean,
  ) {
    for (const a of actors) {
      const current = alongPath(a.points, a.distance, a.offset),
        distance = Math.hypot(current.x - focus[0], current.z - focus[1]);
      a.model.group.visible =
        enabled && distance < 330 && hour > 5 && hour < 24;
      a.model.passengers.visible = distance < 70;
      const ahead = alongPath(
        a.points,
        Math.min(a.length, a.distance + 9),
        a.offset,
      );
      const nearPlayer =
        Math.hypot(ahead.x - focus[0], ahead.z - focus[1]) < 4 ||
        Math.hypot(current.x - focus[0], current.z - focus[1]) <
          a.model.length / 2 + 2;
      const other = actors.some(
        (b) =>
          b !== a &&
          b.model.group.visible &&
          Math.hypot(
            b.model.group.position.x - ahead.x,
            b.model.group.position.z - ahead.z,
          ) < 3.2,
      );
      if (!reduced && !nearPlayer && !other)
        a.distance = Math.min(
          a.length,
          a.distance + Math.min(dt, 0.05) * a.speed,
        );
      if (a.distance >= a.length && distance > 100) a.distance = 0; // never visibly teleport across an endpoint
      const p = alongPath(a.points, a.distance, a.offset);
      a.model.group.position.set(p.x, 0.04, p.z);
      a.model.group.rotation.y = p.yaw;
      if (!reduced && !nearPlayer && !other)
        a.model.wheels.forEach((w) =>
          w.rotateY((-dt * a.speed) / (a.bus ? 0.5 : 0.31)),
        );
    }
  }
  return { group, actors, update };
}
