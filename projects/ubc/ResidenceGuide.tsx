import {
  orchardRooms,
  orchardBathrooms,
  orchardAnchor,
  residenceFloor,
} from "./residence-layout";
import { local } from "./spatial";
import type { Pose } from "./types";
import styles from "./campus.module.css";

export function ResidenceGuide({
  pose,
  close,
}: {
  pose?: Pose;
  close: () => void;
}) {
  const p = pose ? local([pose.x, pose.z], orchardAnchor) : [0, 12];
  const upstairs = !!pose && pose.y > 2.5;
  return (
    <>
      <span className={styles.badge}>ORCHARD OPEN HOUSE</span>
      <h2>Your residence guide.</h2>
      <p>
        {upstairs
          ? "You’re on the demonstration floor."
          : "You’re on the lobby level. Follow the signs to the stairs or lift on your right."}{" "}
        Rooms A–H are fictional spaces, with six connected singles and two
        shared doubles.
      </p>
      <svg
        className={styles.residencePlan}
        viewBox="-19 -10 39 25"
        role="img"
        aria-label="Representative residence floor plan, courtyard at the bottom"
      >
        <rect
          x="-18"
          y="-9"
          width="36"
          height="18"
          fill="#d9d8ca"
          stroke="#485b53"
          strokeWidth="0.12"
        />
        <rect x="-17.9" y="-1.35" width="35.8" height="2.7" fill="#f6f1df" />
        {orchardRooms.map((r) => (
          <g key={r.id}>
            <rect
              x={r.minX}
              y={r.side === 1 ? 1.35 : -8.6}
              width={r.maxX - r.minX}
              height="7.25"
              fill={r.beds === 2 ? "#d7bc87" : "#acc8b8"}
              stroke="#485b53"
              strokeWidth="0.1"
            />
            <text
              x={(r.minX + r.maxX) / 2}
              y={r.side * 3.2}
              textAnchor="middle"
              fontSize="1.3"
              fill="#183c35"
            >
              {r.id.toUpperCase()}
            </text>
          </g>
        ))}
        {orchardBathrooms.map((b) => (
          <rect
            key={b.id}
            x={b.minX}
            y={b.minZ}
            width={b.maxX - b.minX}
            height={b.maxZ - b.minZ}
            fill="#7ca5af"
            stroke="#485b53"
            strokeWidth="0.1"
          />
        ))}
        <text x="5" y="4.5" textAnchor="middle" fontSize="0.9">
          Lounge
        </text>
        <text x="5" y="6.5" textAnchor="middle" fontSize="0.7">
          Snack kitchen
        </text>
        <text x="5" y="-5" textAnchor="middle" fontSize="0.9">
          Study
        </text>
        <rect x="10" y="3.85" width="7" height="2.4" fill="#b28b5c" />
        <text x="13.5" y="5.45" textAnchor="middle" fontSize="0.8">
          Stairs
        </text>
        <rect x="12.4" y="-4.7" width="2.5" height="2.4" fill="#8c9f95" />
        <text x="13.7" y="-1.7" textAnchor="middle" fontSize="0.75">
          Lift
        </text>
        <text x="0" y="12" textAnchor="middle" fontSize="0.9">
          Courtyard entrance · lobby level
        </text>
        <circle
          data-testid="residence-visitor"
          cx={p[0]}
          cy={p[1]}
          r="0.55"
          fill="#d55731"
          stroke="#fff"
          strokeWidth="0.17"
        >
          <title>
            You are here · {upstairs ? "demonstration floor" : "lobby"}
          </title>
        </circle>
        <path
          d={`M${p[0]},${p[1]} l${Math.sin((pose?.yaw || 0) - orchardAnchor.yaw) * -1.2},${Math.cos((pose?.yaw || 0) - orchardAnchor.yaw) * -1.2}`}
          stroke="#d55731"
          strokeWidth="0.24"
        />
      </svg>
      <p className={styles.disclaimer}>
        Schematic, not an as-built floor plan. Blue rooms are shared bathrooms:
        A↔B, C↔D and E↔F. G and H each contain two beds and their own shared
        private bathroom.
      </p>
      <ul>
        <li>
          Bedroom and bathroom doors: approach, press E or tap. Step clear of a
          moving leaf.
        </li>
        <li>
          Lift: call it from a landing, step fully onto the platform, then use
          Ride lift.
        </li>
        <li>
          Maya is by the study tables; Leo is in the lounge; Ari welcomes
          visitors in the lobby.
        </li>
        <li>
          Exit: return down the stairs or lift and follow the courtyard sign.
        </li>
      </ul>
      <p>
        <small>
          One demonstration floor, {residenceFloor} m above this reconstructed
          lobby. Upper storeys are exterior only.
        </small>
      </p>
      <button className={styles.primary} onClick={close}>
        Return to walking
      </button>
    </>
  );
}
