import { memo, useMemo } from "react";
import type { City, DriveTelemetry } from "./types";
import styles from "./vancouver.module.css";

const MapGeometry = memo(function MapGeometry({ city }: { city: City }) {
  const lines = useMemo(() => city.roads.filter((r) => !r.bridge).map((r) => `M${r.points.map((p) => p.join(",")).join("L")}`), [city]);
  return <>
    <rect x="-900" y="-650" width="1800" height="1300" fill="#d8dfd1" />
    {city.water.map((p, i) => <path key={i} d={p.map((ring) => `M${ring.map((v) => v.join(",")).join("L")}Z`).join("")} fill="#5c929c" fillRule="evenodd" />)}
    {lines.map((d, i) => <path key={i} d={d} stroke="#f8f6e9" strokeWidth="10" fill="none" />)}
    {Object.entries(city.anchors).map(([id, p]) => <circle key={id} cx={p[0]} cy={p[1]} r="14" fill="#007c72" />)}
  </>;
});

export function MiniMap({ city, drive }: { city: City; drive: DriveTelemetry }) {
  return <div className={styles.miniMap}>
    <span className={styles.north}>N ↑</span>
    <svg viewBox="-900 -650 1800 1300" role="img" aria-label={`Your car near ${drive.street}. North is up.`}>
      <MapGeometry city={city} />
      <circle cx={drive.x} cy={drive.z} r="56" fill="#fff" stroke="#153d3d" strokeWidth="10" />
      <path d="M0 -43L29 26L0 13L-29 26Z" fill="#087b70" transform={`translate(${drive.x} ${drive.z}) rotate(${180 - drive.yaw * 180 / Math.PI})`} />
    </svg>
  </div>;
}
