import { memo } from "react";
import type { City, Point, Snapshot } from "./types";
import styles from "./surrey.module.css";
const path = (p: Point[]) => `M${p.map((v) => v.join(",")).join("L")}`;
const Geometry = memo(function Geometry({ city }: { city: City }) {
  return (
    <>
      <rect
        x={city.bounds[0]}
        y={city.bounds[1]}
        width={city.bounds[2] - city.bounds[0]}
        height={city.bounds[3] - city.bounds[1]}
        fill="#223d3a"
      />
      {city.parks.map((p, i) => (
        <path
          key={`p${i}`}
          d={p.shape.map((r) => path(r) + "Z").join("")}
          fill="#426f51"
        />
      ))}
      {city.pavement.map((p, i) => (
        <path
          key={`r${i}`}
          d={p.map(r => path(r) + "Z").join("")}
          fill="#7c9291"
          fillRule="evenodd"
        />
      ))}
      {city.buildings.map((b, i) => (
        <path
          key={`b${i}`}
          d={b.shape.map((r) => path(r) + "Z").join("")}
          fill="#49605f"
          fillRule="evenodd"
        />
      ))}
      {city.rail.map((r, i) => (
        <path
          key={`t${i}`}
          d={path(r)}
          stroke="#bad2cf"
          strokeWidth="3"
          strokeDasharray="7 5"
          fill="none"
        />
      ))}
    </>
  );
});
export function MiniMap({
  city,
  state,
  wide,
  close,
}: {
  city: City;
  state: Snapshot;
  wide: boolean;
  close: () => void;
}) {
  const span = wide ? 1500 : 290,
    x = wide ? city.bounds[0] - 80 : state.player.x - span / 2,
    z = wide ? city.bounds[1] : state.player.z - span / 2;
  const scale = span / 290,
    poi = [
      { p: city.anchors.spawn, name: "Station", color: "#e7ece0" },
      { p: city.anchors.community, name: "Community", color: "#7ddfe1" },
      { p: [city.anchors.spawn[0] - 12, city.anchors.spawn[1] - 5] as Point, name: "Case 03", color: "#92e4ad" },
      { p: city.anchors.mystery, name: "Case 02", color: "#c8ace5" },
    ];
  return (
    <div className={`${styles.map} ${wide ? styles.wideMap : ""}`}>
      {wide && <button autoFocus className={styles.closeMap} onClick={close}>Close map ×</button>}
      <span className={styles.north}>N ↑</span>
      <svg
        viewBox={`${x} ${z} ${span} ${span}`}
        role="img"
        aria-label={`North-up map. Player near ${state.street}. Gold diamond: ${state.objective}. White: station. Blue: community. Purple: case 02. Green: case 03.`}
      >
        <Geometry city={city} />
        {poi.map(({ p, name, color }) => (
          <g key={name}>
            <circle cx={p[0]} cy={p[1]} r={4 * scale} fill={color} />
            {wide && (
              <text x={p[0] + 12} y={p[1] + 5} fill="white" fontSize="22">
                {name}
              </text>
            )}
          </g>
        ))}
        <path
          d="M0 -9L7 0L0 9L-7 0Z"
          transform={`translate(${state.marker[0]},${state.marker[1]}) scale(${scale})`}
          fill="#ffce70"
          stroke="#1c2d2c"
          strokeWidth="2"
        />
        {state.waypoint && <g><circle cx={state.waypoint.point[0]} cy={state.waypoint.point[1]} r={9 * scale} fill="none" stroke="#78e3ef" strokeWidth={2 * scale} /><path d="M-5 0H5M0 -5V5" transform={`translate(${state.waypoint.point[0]},${state.waypoint.point[1]}) scale(${scale})`} stroke="#78e3ef" strokeWidth="2" /></g>}
        {state.encounter && <circle cx={state.encounter.position[0]} cy={state.encounter.position[1]} r={5 * scale} fill="#f49c8d" />}
        {state.danger.active && (
          <circle
            cx={state.danger.position[0]}
            cy={state.danger.position[1]}
            r={5 * scale}
            fill="#f08675"
          />
        )}
        <circle
          cx={state.player.x}
          cy={state.player.z}
          r={7 * scale}
          fill="#f1f8eb"
        />
        <path
          d="M0 5L-4 -4L0 -2L4 -4Z"
          fill="#146d63"
          transform={`translate(${state.player.x},${state.player.z}) rotate(${(-state.player.yaw * 180) / Math.PI}) scale(${scale})`}
        />
      </svg>
      <span className={styles.mapCaption}>
        {wide ? "CITY CENTRE · 1.4 KM" : "SURREY CENTRAL"}
      </span>
    </div>
  );
}
