import * as THREE from "three";
import type { Point } from "./types";

type Vertex = number[][];
type Opening = {
  ring: Point[];
  direction: number;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

function prepareOpening(points: Point[]): Opening {
  const ring = points.map(([x, z]): Point => [x, z]);
  if (
    ring.length > 1 &&
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1]
  )
    ring.pop();
  if (ring.length < 3 || ring.some((p) => !p.every(Number.isFinite)))
    throw new Error("Ground openings require finite convex polygons.");
  const area = ring.reduce((sum, p, i) => {
    const q = ring[(i + 1) % ring.length];
    return sum + p[0] * q[1] - q[0] * p[1];
  }, 0);
  if (Math.abs(area) < 1e-8)
    throw new Error("Ground openings must enclose an area.");
  const direction = Math.sign(area);
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i],
      b = ring[(i + 1) % ring.length];
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-8)
      throw new Error("Ground openings cannot have duplicate adjacent vertices.");
    // Every vertex must lie in the same half-plane of each boundary edge.
    if (
      ring.some(
        (p) =>
          direction *
            ((b[0] - a[0]) * (p[1] - a[1]) -
              (b[1] - a[1]) * (p[0] - a[0])) <
          -1e-8,
      )
    )
      throw new Error("Ground openings must be convex.");
  }
  return {
    ring,
    direction,
    minX: Math.min(...ring.map((p) => p[0])),
    maxX: Math.max(...ring.map((p) => p[0])),
    minZ: Math.min(...ring.map((p) => p[1])),
    maxZ: Math.max(...ring.map((p) => p[1])),
  };
}

/**
 * Subtract convex world-XZ openings from an already transformed ground mesh.
 * Triangles are split at the exact boundary, preserving interpolated UVs and
 * other vertex attributes. Source data and the input geometry remain intact.
 * The caller owns the returned, non-indexed geometry and the original.
 */
export function subtractGroundOpenings(
  geometry: THREE.BufferGeometry,
  groundOpenings: Point[][],
): THREE.BufferGeometry {
  const openings = groundOpenings.map(prepareOpening),
    entries = Object.entries(geometry.attributes),
    positionIndex = entries.findIndex(([name]) => name === "position"),
    position = geometry.getAttribute("position");
  if (positionIndex < 0 || position.itemSize !== 3)
    throw new Error("Ground geometry requires three-dimensional positions.");
  const unchanged = () =>
    geometry.index ? geometry.toNonIndexed() : geometry.clone();
  if (!openings.length || !position.count) return unchanged();
  const bounds = new THREE.Box3().setFromBufferAttribute(
    position as THREE.BufferAttribute,
  );
  const relevant = openings.filter(
    (o) =>
      bounds.max.x > o.minX &&
      bounds.min.x < o.maxX &&
      bounds.max.z > o.minZ &&
      bounds.min.z < o.maxZ,
  );
  if (!relevant.length) return unchanged();

  const values = entries.map((): number[] => []),
    index = geometry.getIndex(),
    count = index?.count ?? position.count;
  const read = (i: number): Vertex =>
    entries.map(([, attribute]) =>
      Array.from({ length: attribute.itemSize }, (_, component) =>
        attribute.getComponent(index ? index.getX(i) : i, component),
      ),
    );
  const interpolate = (a: Vertex, b: Vertex, t: number): Vertex =>
    a.map((attribute, i) =>
      attribute.map((value, j) => value + (b[i][j] - value) * t),
    );
  const hasArea=(polygon:Vertex[])=>polygon.length>=3&&Math.abs(polygon.reduce((sum,v,i)=>{
    const p=v[positionIndex],q=polygon[(i+1)%polygon.length][positionIndex];
    return sum+p[0]*q[2]-q[0]*p[2];
  },0))>1e-8;

  for (let i = 0; i < count; i += 3) {
    let polygons = [[read(i), read(i + 1), read(i + 2)]];
    for (const opening of relevant) {
      const remaining: Vertex[][] = [];
      for (const polygon of polygons) {
        let inner = polygon;
        for (let edge = 0; edge < opening.ring.length && inner.length; edge++) {
          const a = opening.ring[edge],
            b = opening.ring[(edge + 1) % opening.ring.length],
            distance = (vertex: Vertex) => {
              const p = vertex[positionIndex];
              return (
                opening.direction *
                ((b[0] - a[0]) * (p[2] - a[1]) -
                  (b[1] - a[1]) * (p[0] - a[0]))
              );
            },
            inside: Vertex[] = [],
            outside: Vertex[] = [];
          for (let v = 0; v < inner.length; v++) {
            const p = inner[v],
              q = inner[(v + 1) % inner.length],
              dp = distance(p),
              dq = distance(q);
            if (dp >= 0) inside.push(p);
            if (dp <= 0) outside.push(p);
            if ((dp < 0 && dq > 0) || (dp > 0 && dq < 0)) {
              const crossing = interpolate(p, q, dp / (dp - dq));
              inside.push(crossing);
              outside.push(crossing);
            }
          }
          // Everything outside this edge is outside the whole opening. Only
          // the inner portion needs clipping against subsequent edges.
          // Adjacent exclusion triangles share edges. Discard zero-area edge
          // fragments here so repeated cuts cannot multiply degenerate pieces.
          if (hasArea(outside)) remaining.push(outside);
          inner = hasArea(inside) ? inside : [];
        }
      }
      polygons = remaining;
    }
    for (const polygon of polygons)
      for (let v = 1; v < polygon.length - 1; v++) {
        const triangle = [polygon[0], polygon[v], polygon[v + 1]],
          [a, b, c] = triangle.map((vertex) => vertex[positionIndex]),
          area =
            (b[0] - a[0]) * (c[2] - a[2]) -
            (b[2] - a[2]) * (c[0] - a[0]);
        if (Math.abs(area) < 1e-10) continue;
        for (const vertex of triangle)
          vertex.forEach((attribute, j) => values[j].push(...attribute));
      }
  }
  const result = new THREE.BufferGeometry();
  entries.forEach(([name, attribute], i) => {
    result.setAttribute(
      name,
      new THREE.Float32BufferAttribute(values[i], attribute.itemSize),
    );
  });
  result.name = geometry.name;
  result.userData = { ...geometry.userData };
  result.computeBoundingBox();
  result.computeBoundingSphere();
  return result;
}
