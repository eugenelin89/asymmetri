import { memo, useMemo, useState } from "react";
import type { City, DriveRoute, DriveTelemetry, Point2 } from "./types";
import styles from "./vancouver.module.css";

const path = (points: [number, number][]) => `M${points.map((p) => p.join(",")).join("L")}`;
const MapGeometry = memo(function MapGeometry({ city }: { city: City }) {
  const roads = useMemo(() => (city.graph?.edges ?? city.roads.filter((r) => !r.bridge)).map((r) => path(r.points)), [city]);
  return <>
    <rect x="-1000" y="-750" width="2000" height="1500" fill="#d8dfd1" />
    {city.water.map((p, i) => <path key={i} d={p.map((ring) => `${path(ring)}Z`).join("")} fill="#5c929c" fillRule="evenodd" />)}
    {city.roads.filter((r) => r.bridge).map((r, i) => <path key={`bridge${i}`} d={path(r.points)} stroke="#84989a" strokeWidth="9" strokeDasharray="13 9" fill="none" />)}
    {roads.map((d, i) => <path key={i} d={d} stroke="#f8f6e9" strokeWidth="10" fill="none" />)}
    <path d={`${path(city.bounds)}Z`} fill="none" stroke="#466b60" strokeWidth="9" strokeDasharray="24 16"><title>Boundary of the modelled False Creek area</title></path>
    {Object.entries(city.anchors).map(([id, p], i) => <g key={id}><circle cx={p[0]} cy={p[1]} r="17" fill="#17665f" /><text x={p[0]} y={p[1] + 8} textAnchor="middle" fill="white" fontSize="24" fontWeight="700">{i + 1}</text></g>)}
  </>;
});
const RouteLine = memo(function RouteLine({ route }: { route: DriveRoute }) {
  return <path d={path(route.points)} stroke="#a96512" strokeWidth="11" fill="none" strokeLinejoin="round" />;
});
export function MiniMap({ city, drive, route, onDestination }: { city: City; drive: DriveTelemetry; route: DriveRoute | null; onDestination(point: Point2): void }) {
  const [wide, setWide] = useState(false);
  const [cursor, setCursor] = useState<Point2 | null>(null);
  const span = wide ? 1800 : 620, height = span * .76;
  const x = wide ? -900 : drive.x - span / 2, z = wide ? -650 : drive.z - height / 2;
  const scale = span / 620;
  return <div className={styles.miniMap}>
    <span className={styles.north}>N ↑</span>
    <svg viewBox={`${x} ${z} ${span} ${height}`} role="button" tabIndex={0} aria-label={`Route map near ${drive.street}. North is up. Tap a ground street for directions. Arrow keys move a target; Enter routes there; Escape clears the target. Dashed bridges are view-only.`}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const point: Point2 = [x + (event.clientX - rect.left) / rect.width * span, z + (event.clientY - rect.top) / rect.height * height];
        setCursor(point); onDestination(point);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onDestination(cursor ?? [drive.x, drive.z]); }
        if (event.key === "Escape") setCursor(null);
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
          event.preventDefault(); const point = cursor ?? [drive.x, drive.z];
          setCursor([Math.max(x, Math.min(x + span, point[0] + (event.key === "ArrowRight" ? 25 : event.key === "ArrowLeft" ? -25 : 0))), Math.max(z, Math.min(z + height, point[1] + (event.key === "ArrowDown" ? 25 : event.key === "ArrowUp" ? -25 : 0)))]);
        }
      }}>
      <MapGeometry city={city} />
      {route && <RouteLine route={route} />}
      {route && !route.loop && <circle cx={route.points.at(-1)![0]} cy={route.points.at(-1)![1]} r="21" stroke="#a96512" strokeWidth="7" fill="white" />}
      <circle cx={drive.x} cy={drive.z} r={27 * scale} fill="#fff" stroke="#153d3d" strokeWidth={4 * scale} />
      <path d="M0 -19L14 13L0 6L-14 13Z" fill="#087b70" transform={`translate(${drive.x} ${drive.z}) rotate(${180 - drive.yaw * 180 / Math.PI}) scale(${scale})`} />
      {cursor && <g stroke="#723e11" strokeWidth={3 * scale} fill="none"><circle cx={cursor[0]} cy={cursor[1]} r={16 * scale} /><path d={`M${cursor[0] - 24 * scale},${cursor[1]}h${48 * scale}M${cursor[0]},${cursor[1] - 24 * scale}v${48 * scale}`} /></g>}
    </svg>
    <p className={styles.mapCaption}>{wide ? "False Creek coverage" : "Your nearby streets"} · north up</p>
    <button type="button" onClick={() => setWide((value) => !value)} aria-label={wide ? "Show nearby streets on map" : "Show playable False Creek area on map"}>{wide ? "Nearby streets" : "Playable area"} ↗</button>
  </div>;
}
