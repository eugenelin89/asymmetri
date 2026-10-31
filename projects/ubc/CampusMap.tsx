import { useMemo, useState } from "react";
import type { Anchors, CampusData, Point } from "./types";
import { places } from "./registry";
import styles from "./campus.module.css";

export function CampusMap({
  data,
  anchors,
  pose,
  route,
  onSelect,
  resolve,
  onTravel,
  onGuide,
}: {
  data: CampusData;
  anchors: Anchors;
  pose: Point;
  route: Point[] | null;
  onSelect: (id: string) => void;
  resolve: (point: Point) => Point | null;
  onTravel: (point: Point) => void;
  onGuide: (point: Point, name: string) => void;
}) {
  const [zoom, setZoom] = useState(1),
    [center, setCenter] = useState<Point>([0, -150]);
  const [selection, setSelection] = useState<{
    raw: Point;
    point: Point | null;
    name: string;
    id?: string;
  } | null>(null);
  const mark = (raw: Point, name = "Selected map spot", id?: string) =>
    setSelection({ raw, point: resolve(raw), name, id });
  const w = 2800 / zoom,
    h = 3300 / zoom;
  const geometry = useMemo(() => {
    const path = (rings: Point[][]) =>
      rings.map((r) => `M${r.map((p) => p.join(",")).join("L")}Z`).join("");
    return (
      <g aria-hidden="true">
        {data.surfaces.map((s) => (
          <path
            key={s.id}
            d={path(s.rings)}
            fill={
              /road|parking|drive/i.test(s.kind)
                ? "#babdb5"
                : /lawn|grass|plant|forest|wild|garden|farm/i.test(s.kind)
                  ? "#bfcbb0"
                  : "#d7d9cd"
            }
            fillRule="evenodd"
          />
        ))}
        {data.buildings.map((b) => (
          <path
            key={b.id}
            d={path(b.rings)}
            fill="#9ca9a3"
            stroke="#eef0e5"
            strokeWidth="1"
            fillRule="evenodd"
            data-building-id={b.id}
          >
            <title>{b.name}</title>
          </path>
        ))}
      </g>
    );
  }, [data]);
  return (
    <div className={styles.map}>
      <div className={styles.mapLegend}>
        <strong>Campus atlas</strong>
        <span>↑ NORTH</span>
        <small>Click a spot · Go here or Guide me</small>
      </div>
      <svg
        aria-label="Geographic campus map"
        role="application"
        tabIndex={0}
        aria-describedby="campus-map-instructions"
        onClick={(e) => {
          const matrix = e.currentTarget.getScreenCTM();
          if (!matrix) return;
          const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(
            matrix.inverse(),
          );
          const id =
            (e.target as Element)
              .closest("[data-building-id]")
              ?.getAttribute("data-building-id") || undefined;
          mark(
            [p.x, p.y],
            data.buildings.find((b) => b.id === id)?.name ||
              "Selected map spot",
            id,
          );
        }}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          const directions: Record<string, Point> = {
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0],
            ArrowUp: [0, -1],
            ArrowDown: [0, 1],
          };
          const d = directions[e.key];
          if (d) {
            e.preventDefault();
            e.stopPropagation();
            const p = selection?.raw || pose;
            mark([p[0] + (d[0] * 25) / zoom, p[1] + (d[1] * 25) / zoom]);
          } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            mark(selection?.raw || center);
          }
        }}
        viewBox={`${center[0] - w / 2} ${center[1] - h / 2} ${w} ${h}`}
      >
        <rect x="-2500" y="-2500" width="5000" height="5000" fill="#e3e7db" />
        {geometry}
        {route && (
          <polyline
            points={route.map((p) => p.join(",")).join(" ")}
            stroke="#ad6e22"
            strokeWidth="5"
            fill="none"
          />
        )}
        {places.map((p) => {
          const a = anchors[p.id];
          return a ? (
            <g
              key={p.id}
              role="button"
              tabIndex={0}
              aria-label={p.name}
              onClick={(e) => {
                e.stopPropagation();
                mark(a.entry || [a.x, a.z], p.name, p.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  mark(a.entry || [a.x, a.z], p.name, p.id);
                }
              }}
            >
              <circle
                cx={a.x}
                cy={a.z}
                r={15 / zoom}
                fill={p.interior === "B" ? "#174c46" : "#f1f2e8"}
                stroke="#174c46"
                strokeWidth="3"
              />
              <text
                x={a.x + 24 / zoom}
                y={a.z + 5 / zoom}
                fontSize={19 / zoom}
                fill="#203a34"
              >
                {p.name.replace("UBC ", "")}
              </text>
              <title>{p.name}</title>
            </g>
          ) : null;
        })}
        {selection && (
          <g pointerEvents="none" aria-label="Selected destination">
            <circle
              cx={(selection.point || selection.raw)[0]}
              cy={(selection.point || selection.raw)[1]}
              r={18 / zoom}
              fill={selection.point ? "#ac6b25" : "#a14235"}
              stroke="white"
              strokeWidth={4 / zoom}
            />
            <text
              x={(selection.point || selection.raw)[0]}
              y={(selection.point || selection.raw)[1] - 28 / zoom}
              textAnchor="middle"
              fontSize={20 / zoom}
            >
              Destination
            </text>
          </g>
        )}
        <circle
          data-testid="campus-map-visitor"
          cx={pose[0]}
          cy={pose[1]}
          r={11 / zoom}
          fill="#d08235"
          stroke="white"
          strokeWidth="5"
        />
        <text
          x={pose[0]}
          y={pose[1] - 22 / zoom}
          textAnchor="middle"
          fontSize={20 / zoom}
          fill="#684019"
        >
          You are here
        </text>
      </svg>
      <p id="campus-map-instructions" className={styles.mapInstructions}>
        Click/tap a location, or focus the map and use arrow keys to move a pin.
        Enter marks the centre. Travel uses a nearby safe outdoor path.
      </p>
      {selection && (
        <section
          className={styles.mapDestination}
          aria-label="Selected map destination"
        >
          <strong>{selection.name}</strong>
          <small>
            {selection.point
              ? `Outdoor path selected · ${Math.round(Math.hypot(selection.point[0] - selection.raw[0], selection.point[1] - selection.raw[1]))} m from your pin`
              : "No safe outdoor path within 120 m. Choose another spot."}
          </small>
          <div>
            <button
              disabled={!selection.point}
              onClick={() => selection.point && onTravel(selection.point)}
            >
              Go here
            </button>
            <button
              disabled={!selection.point}
              onClick={() =>
                selection.point && onGuide(selection.point, selection.name)
              }
            >
              Guide me
            </button>
            {selection.id && (
              <button onClick={() => onSelect(selection.id!)}>
                Place info
              </button>
            )}
            <button
              aria-label="Clear map selection"
              onClick={() => setSelection(null)}
            >
              ×
            </button>
          </div>
        </section>
      )}
      <div className={styles.mapControls}>
        <button
          aria-label="Zoom in map"
          onClick={() => setZoom((z) => Math.min(4, z * 1.4))}
        >
          +
        </button>
        <button
          aria-label="Zoom out map"
          onClick={() => setZoom((z) => Math.max(0.7, z / 1.4))}
        >
          −
        </button>
        <button onClick={() => setCenter(pose)}>Find me</button>
        <button
          onClick={() => {
            setCenter([0, -150]);
            setZoom(1);
          }}
        >
          Campus
        </button>
      </div>
    </div>
  );
}
