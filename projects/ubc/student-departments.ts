import type { Anchors, CampusData, Character, Point } from "./types";
import { studentSeed } from "./student-import";

/** Building IDs refer to the committed UBC open-GIS snapshot. These describe
 * simulated public department-area encounters, never a person's office,
 * classes, schedule or actual whereabouts. Broad/interdisciplinary programs use
 * faculty public areas; several medical programs also work off this campus. */
export const studentDepartmentAreas = {
  mathematics: { buildings: ["VBL10229", "VBL10216", "VBL10252"], label: "Mathematics buildings and nearby public paths" },
  economics: { buildings: ["VBL10292"], label: "Iona Building and nearby public paths" },
  psychology: { buildings: ["VBL10131"], label: "Douglas T. Kenny Building and nearby public paths" },
  statistics: { buildings: ["VBL10072"], label: "Earth Sciences Building and nearby public paths" },
  physics: { buildings: ["VBL10359"], label: "Hennings and nearby public paths" },
  chemistry: { buildings: ["VBL10328"], label: "Chemistry buildings and nearby public paths" },
  biology: { buildings: ["VBL10409"], label: "Biological Sciences and nearby public paths" },
  earth: { buildings: ["VBL10072"], label: "Earth Sciences and nearby public paths" },
  geography: { buildings: ["VBL10411"], label: "Geography and nearby public paths" },
  planning: { buildings: ["VBL10283"], label: "West Mall Annex and nearby public paths" },
  architecture: { buildings: ["VBL10042"], label: "Lasserre and nearby public paths" },
  music: { buildings: ["VBL10101"], label: "Music Building and nearby public paths" },
  anthropology: { buildings: ["VBL10204"], label: "Anthropology and Sociology and nearby public paths" },
  engineering: { buildings: ["VBL10085", "VBL10329"], label: "Engineering public areas" },
  chemical: { buildings: ["VBL10062"], label: "Chemical and Biological Engineering and nearby public paths" },
  pharmacy: { buildings: ["VBL10110"], label: "Pharmaceutical Sciences and nearby public paths" },
  forestry: { buildings: ["VBL10119"], label: "Forest Sciences and nearby public paths" },
  landfood: { buildings: ["VBL10060"], label: "Land and Food Systems public areas" },
  education: { buildings: ["VBL10095"], label: "Education public areas near Neville Scarfe" },
  law: { buildings: ["VBL10104"], label: "Allard Hall and nearby public paths" },
  computer: { buildings: ["VBL10078"], label: "Computer Science and nearby public paths" },
  health: { buildings: ["VBL10102", "VBL10111"], label: "Medicine and life-science public areas" },
  population: { buildings: ["VBL10107"], label: "Population and Public Health and nearby public paths" },
  kinesiology: { buildings: ["VBL10251", "VBL10296"], label: "Osborne Centre and nearby public paths" },
  journalism: { buildings: ["VBL10348"], label: "Sing Tao Building and nearby public paths" },
  linguistics: { buildings: ["VBL10223"], label: "Totem Field Studios and nearby public paths" },
  theatre: { buildings: ["VBL10405"], label: "Frederic Wood Theatre and nearby public paths" },
  library: { buildings: ["VBL10080"], label: "Irving K. Barber Learning Centre public areas" },
  sustainability: { buildings: ["VBL10162"], label: "CIRS and nearby sustainability public areas" },
  arts: { buildings: ["VBL10323", "VBL10324"], label: "Buchanan and nearby Arts public areas" },
  graduate: { buildings: ["VBL10249"], label: "Graduate student public areas" },
} as const;
export type StudentDepartmentArea = keyof typeof studentDepartmentAreas;

export function studentDepartment(program: string): StudentDepartmentArea {
  if (program === "Mathematics") return "mathematics";
  if (program === "Economics") return "economics";
  if (program === "Psychology") return "psychology";
  if (program === "Statistics") return "statistics";
  if (/Physics/.test(program)) return "physics";
  if (program === "Chemistry") return "chemistry";
  if (/Chemical/.test(program)) return "chemical";
  if (/Geological|Oceanography|Oceans and Fisheries/.test(program)) return "earth";
  if (program === "Geography") return "geography";
  if (program === "Planning") return "planning";
  if (/Architecture/.test(program)) return "architecture";
  if (/Musical|Music,/.test(program)) return "music";
  if (/Anthropology|Sociology/.test(program)) return "anthropology";
  if (/Pharmaceutical/.test(program)) return "pharmacy";
  if (program === "Forestry") return "forestry";
  if (/Animal|Human Nutrition|Land and Food|Plant Science/.test(program)) return "landfood";
  if (/Curriculum|Education|Literacy|Counselling|Special Education/.test(program)) return "education";
  if (/Law/.test(program)) return "law";
  if (program === "Computer Science") return "computer";
  if (/Population|Occupational and Environmental Hygiene/.test(program)) return "population";
  if (/Kinesiology/.test(program)) return "kinesiology";
  if (/Journalism/.test(program)) return "journalism";
  if (program === "Linguistics") return "linguistics";
  if (program === "Theatre") return "theatre";
  if (/Library/.test(program)) return "library";
  if (/Sustainability/.test(program)) return "sustainability";
  if (/Engineering/.test(program) && program !== "Biomedical Engineering") return "engineering";
  if (/Botany|Zoology|Microbiology|Cell and Developmental|Biochemistry|Bioinformatics/.test(program)) return "biology";
  if (/Medicine|Medical|Neuroscience|Oncology|Nursing|Rehabilitation|Audiology|Biomedical|Health Sciences/.test(program)) return "health";
  if (program === "Interdisciplinary Studies") return "graduate";
  return "arts";
}

export function studentZone(program: string, id: string): string {
  const area = studentDepartment(program);
  const buildings = studentDepartmentAreas[area].buildings;
  return `student-${area}-${studentSeed(id) % buildings.length}`;
}

export function createStudentDepartmentAnchors(data: CampusData): Anchors {
  const anchors: Anchors = {};
  for (const [area, config] of Object.entries(studentDepartmentAreas)) {
    config.buildings.forEach((id, index) => {
      const building = data.buildings.find((b) => b.id === id);
      if (!building) return;
      const points = building.rings.flat();
      const minX = Math.min(...points.map((p) => p[0])), maxX = Math.max(...points.map((p) => p[0]));
      const minZ = Math.min(...points.map((p) => p[1])), maxZ = Math.max(...points.map((p) => p[1]));
      const key = `student-${area}-${index}`;
      // This box centres route searches only; it is not a replacement building model.
      anchors[key] = { id: key, x: (minX + maxX) / 2, z: (minZ + maxZ) / 2, width: maxX - minX, depth: maxZ - minZ, yaw: 0, buildingId: id };
    });
  }
  return anchors;
}

const distance = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
type StudentPath = { points: Point[]; length: number; centre: Point };
export function planStudentRoutes(
  students: readonly Pick<Character, "id" | "zone">[],
  data: CampusData,
  anchors: Anchors,
  blocked: (p: Point, y: number) => boolean,
): Map<string, Point[]> {
  const routes = new Map<string, Point[]>();
  const zones = new Map<string, typeof students[number][]>();
  for (const student of students) zones.set(student.zone, [...(zones.get(student.zone) ?? []), student]);
  for (const [zone, members] of zones) {
    const anchor = anchors[zone];
    if (!anchor) continue;
    const paths: StudentPath[] = [];
    const seen = new Set<string>();
    const flush = (points: Point[]) => {
      const length = points.reduce((sum, p, i) => sum + (i ? distance(p, points[i - 1]) : 0), 0);
      if (length < 12) return;
      const forward = JSON.stringify(points), backward = JSON.stringify([...points].reverse());
      const key = forward < backward ? forward : backward;
      if (seen.has(key)) return;
      seen.add(key);
      paths.push({ points, length, centre: [points.reduce((s, p) => s + p[0], 0) / points.length, points.reduce((s, p) => s + p[1], 0) / points.length] });
    };
    for (const source of data.routes) {
      let run: Point[] = [], length = 0;
      for (let i = 1; i < source.points.length; i++) {
        const a = source.points[i - 1], b = source.points[i];
        const span = distance(a, b);
        const near = [a, b].every((p) => Math.hypot(p[0] - anchor.x, p[1] - anchor.z) < 175);
        let clear = near && span > 0.2 && span < 170;
        if (clear) for (let n = 0, samples = Math.ceil(span); n <= samples; n++) {
          if (blocked([a[0] + (b[0] - a[0]) * n / samples, a[1] + (b[1] - a[1]) * n / samples], 0)) { clear = false; break; }
        }
        if (!clear) { flush(run); run = []; length = 0; continue; }
        if (length + span > 170) { flush(run); run = []; length = 0; }
        if (!run.length) run.push(a);
        run.push(b); length += span;
      }
      flush(run);
    }
    if (!paths.length) continue;
    // Farthest-first route ordering spreads the first encounters around a
    // department. Every candidate is retained, unlike the old nearest-60 cap.
    const ordered: StudentPath[] = [];
    const remaining = [...paths].sort((a, b) => b.length - a.length).map((path) => ({ path, gap: Infinity }));
    ordered.push(remaining.shift()!.path);
    while (remaining.length) {
      let best = 0, separation = -1;
      for (let i = 0; i < remaining.length; i++) {
        const gap = Math.min(remaining[i].gap, distance(ordered[ordered.length - 1].centre, remaining[i].path.centre));
        remaining[i].gap = gap;
        if (gap > separation) { separation = gap; best = i; }
      }
      ordered.push(remaining.splice(best, 1)[0].path);
    }
    members.sort((a, b) => studentSeed(a.id) - studentSeed(b.id));
    members.forEach((student, index) => {
      const path = ordered[index % ordered.length];
      let offset = path.length * (0.12 + ((studentSeed(student.id + "phase") % 997) / 997) * 0.76);
      let segment = 0;
      while (segment < path.points.length - 2 && offset > distance(path.points[segment], path.points[segment + 1])) {
        offset -= distance(path.points[segment], path.points[segment + 1]); segment++;
      }
      const a = path.points[segment], b = path.points[segment + 1], t = offset / distance(a, b);
      const start: Point = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      // Forward to the end, back to the beginning, then forward to the initial
      // segment. The loop closes on that same source edge, with no chord cuts.
      routes.set(student.id, [start, ...path.points.slice(segment + 1), ...path.points.slice(0, -1).reverse(), ...path.points.slice(1, segment + 1)]);
    });
  }
  return routes;
}

/** Use when filling a vacant streamed slot. Existing on-screen encounters stay
 * stable; the caller releases a long-lived actor only while out of sight.
 * Unseen students take precedence, then least-recently encountered students. */
export function orderStudentEncounters<T extends { id: string; distance: number }>(
  candidates: readonly T[], lastEncounter: ReadonlyMap<string, number>,
): T[] {
  return [...candidates].sort((a, b) => (lastEncounter.get(a.id) ?? -Infinity) - (lastEncounter.get(b.id) ?? -Infinity)
    || a.distance - b.distance || a.id.localeCompare(b.id));
}
