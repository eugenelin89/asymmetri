"use client";
import { useMemo } from "react";
import type { City, Snapshot } from "./types";
import { interiorFor, interiorFixtures } from "./interiors";
export function RichmondMap({
  city,
  snapshot,
  wide = false,
  onSelect,
}: {
  city: City;
  snapshot: Snapshot;
  wide?: boolean;
  onSelect?: (id: string) => void;
}) {
  const s = snapshot.state,
    indoor = s.interior
      ? city.places.find((p) => p.id === s.interior!.place)
      : null;
  const lines = useMemo(
    () =>
      city.roads
        .filter((r) => r.kind !== "path")
        .map((r) => ({
          id: r.id,
          kind: r.kind,
          roadClass: r.class,
          bounds: [
            Math.min(...r.points.map((p) => p[0])),
            Math.min(...r.points.map((p) => p[1])),
            Math.max(...r.points.map((p) => p[0])),
            Math.max(...r.points.map((p) => p[1])),
          ],
          d: r.points
            .map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`)
            .join(" "),
        })),
    [city],
  );
  const l = indoor ? interiorFor(indoor) : null;
  const bounds = l
    ? [-l.width / 2 - 4, -l.depth / 2 - 4, l.width + 8, l.depth + 8]
    : wide
      ? [
          city.bounds[0],
          city.bounds[1],
          city.bounds[2] - city.bounds[0],
          city.bounds[3] - city.bounds[1],
        ]
      : [
          Math.floor(s.player.x / 50) * 50 - 450,
          Math.floor(s.player.z / 50) * 50 - 450,
          900,
          900,
        ];
  const scale = l ? 1 : wide ? 28 : 6;
  const [x, z, w, h] = bounds;
  const streets = useMemo(
    () =>
      lines
        .filter((r) =>
          wide
            ? !["service", "residential", "living_street"].includes(r.roadClass)
            : r.bounds[0] < x + w &&
              r.bounds[2] > x &&
              r.bounds[1] < z + h &&
              r.bounds[3] > z,
        )
        .map((r) => (
          <path
            key={r.id}
            d={r.d}
            fill="none"
            stroke={r.kind === "airfield" ? "#d4d4bd" : "#e2e1ce"}
            strokeWidth={wide ? 8 : 6}
          />
        )),
    [lines, wide, x, z, w, h],
  );
  const water = useMemo(
    () =>
      city.water
        .filter((p) => {
          const xs = p[0].map((v) => v[0]),
            zs = p[0].map((v) => v[1]);
          return (
            Math.min(...xs) < x + w &&
            Math.max(...xs) > x &&
            Math.min(...zs) < z + h &&
            Math.max(...zs) > z
          );
        })
        .map((p, i) => (
          <path
            key={i}
            d={p
              .map(
                (r) =>
                  r.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ") +
                  "Z",
              )
              .join(" ")}
            fill="#88bcc2"
            fillRule="evenodd"
          />
        )),
    [city, x, z, w, h],
  );
  return (
    <svg
      viewBox={bounds.join(" ")}
      role="img"
      aria-label={
        indoor
          ? `Floor guide for ${indoor.name}`
          : "Richmond street map: you, your car and the current delivery"
      }
    >
      <rect
        x={bounds[0]}
        y={bounds[1]}
        width={bounds[2]}
        height={bounds[3]}
        fill="#7f9a7b"
      />
      {l ? (
        <>
          <rect
            x={-l.width / 2}
            y={-l.depth / 2}
            width={l.width}
            height={l.depth}
            fill="#ece2c9"
          />
          {[...l.obstacles, ...interiorFixtures(l)].map((p, i) => (
            <rect
              key={i}
              x={p[0]}
              y={p[1]}
              width={p[2] - p[0]}
              height={p[3] - p[1]}
              fill="#8b9d8e"
            />
          ))}
          <text
            x={l.exit[0]}
            y={l.exit[1]}
            textAnchor="middle"
            fontSize="3"
            fill="#123f39"
          >
            EXIT
          </text>
        </>
      ) : (
        <>
          {water}
          {streets}
        </>
      )}
      <polyline
        points={snapshot.route.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="#e7a13e"
        strokeWidth={scale * 0.8}
      />
      {!l &&
        wide &&
        city.places.map((p) => (
          <g
            key={p.id}
            onClick={() => onSelect?.(p.id)}
            style={{ cursor: onSelect ? "pointer" : undefined }}
          >
            <circle
              cx={p.entrance[0]}
              cy={p.entrance[1]}
              r={scale * 1.3}
              fill="#263f42"
            />
            <text
              x={p.entrance[0] + scale * 2}
              y={p.entrance[1]}
              fontSize={scale * 3.4}
              fill="#163432"
            >
              {p.name}
            </text>
          </g>
        ))}
      {!l && (
        <g>
          <rect
            x={s.car.x - scale}
            y={s.car.z - scale}
            width={scale * 2}
            height={scale * 3}
            fill="#fff0bc"
            stroke="#233e41"
            strokeWidth={scale * 0.35}
          />
          <text
            x={s.car.x + scale * 2}
            y={s.car.z}
            fontSize={scale * 2.4}
            fill="#102c2b"
          >
            CAR
          </text>
        </g>
      )}
      {snapshot.target && (
        <g>
          <circle
            cx={snapshot.target[0]}
            cy={snapshot.target[1]}
            r={scale * 1.6}
            fill="#f2b44c"
            stroke="#563a16"
            strokeWidth={scale * 0.3}
          />
          <text
            x={snapshot.target[0] + scale * 2}
            y={snapshot.target[1]}
            fontSize={scale * 2.4}
            fill="#163b38"
          >
            GOAL
          </text>
        </g>
      )}
      <circle
        cx={s.player.x}
        cy={s.player.z}
        r={scale * 1.4}
        fill="#e76343"
        stroke="#fff"
        strokeWidth={scale * 0.4}
      />
      <text
        x={s.player.x + scale * 2}
        y={s.player.z - scale}
        fontSize={scale * 2.5}
        fill="#182f2e"
      >
        YOU
      </text>
    </svg>
  );
}
