import type { Point } from "./types";
export const namedPopulationLimits = { low: 12, medium: 18, auto: 24, high: 32, ultra: 44 } as const;
/** Every sourced person has a virtual walking position even without a GPU model.
 * Sampling is deterministic, independent of frame rate and roster ordering. */
export function sampleWalkingRoute(route: Point[], seconds: number, seed: number, speed = 1.05): { point: Point; target: number } {
  if (!route.length) return { point: [0,0], target: 0 };
  const lengths = route.map((p,i) => Math.hypot(route[(i+1)%route.length][0]-p[0],route[(i+1)%route.length][1]-p[1]));
  const length = lengths.reduce((a,b)=>a+b,0);
  if (length < .01) return { point: [...route[0]], target: 0 };
  let distance = ((Math.max(0,seconds) * speed + (seed % 1009) / 1009 * length) % length + length) % length;
  for(let i=0;i<route.length;i++) {
    if(distance <= lengths[i] && lengths[i] > .001) {
      const next=(i+1)%route.length, t=distance/lengths[i];
      return { point: [route[i][0]+(route[next][0]-route[i][0])*t,route[i][1]+(route[next][1]-route[i][1])*t], target: next };
    }
    distance-=lengths[i];
  }
  return { point:[...route[0]],target:1%route.length };
}
export function arrivalRoute(route: Point[], point: Point, target: number): Point[] {
  return [[...point],...route.slice(target),...route.slice(0,target)];
}
