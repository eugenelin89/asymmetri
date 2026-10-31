import { residenceFloor, residenceLift, residenceRooms } from "./residence-layout";
import { local } from "./spatial";
import type { Anchor, Pose } from "./types";
import styles from "./campus.module.css";
export function ResidenceGuide({pose,anchor,close}:{pose?:Pose;anchor?:Anchor;close:()=>void}){
 const p=pose&&anchor?local([pose.x,pose.z],anchor):[0,8],upper=!!pose&&pose.y>2;
 return <><span className={styles.badge}>CLARKE OPEN HOUSE</span><h2>Your residence guide.</h2>
 <p>{upper?"You’re on the demonstration floor.":"You’re on the lobby level. Walk to the rear stairs or the lift on the right."} The representative eight-person suite has three double rooms, two singles and a shared bathroom.</p>
 <svg className={styles.residencePlan} viewBox="-9 -9 18 19" role="img" aria-label="Representative Clarke suite plan showing bedrooms A to E, shared bathroom, stairs, lift and your position">
 <rect x="-8" y="-8.5" width="16" height="17" fill="#ece8d9" stroke="#485b53" strokeWidth=".1"/>
 {residenceRooms.map(r=><g key={r.id}><rect x={r.x-r.width/2} y={r.doorZ} width={r.width} height={r.depth} fill={r.beds===2?"#d7bc87":"#acc8b8"} stroke="#485b53" strokeWidth=".07"/><text x={r.x} y="3.1" textAnchor="middle" fontSize=".7">{r.id} · {r.beds===2?"Double":"Single"}</text></g>)}
 <rect x="-7.75" y="-6" width="2.1" height="4.2" fill="#7ca5af"/><text x="-6.7" y="-3" fontSize=".45" textAnchor="middle">Bathroom</text>
 <rect x="-5" y="-6.55" width="10" height="2.7" fill="#b28b5c"/><text x="0" y="-5" fontSize=".7" textAnchor="middle">Stairs</text>
 <rect x={residenceLift.minX} y={residenceLift.minZ} width="2" height="2.6" fill="#8c9f95"/><text x="6.6" y="-5" fontSize=".6" textAnchor="middle">Lift</text>
 <circle cx={p[0]} cy={p[1]} r=".3" fill="#d55731" stroke="white" strokeWidth=".1"><title>You are here</title></circle>
 <text x="0" y="9.4" fontSize=".6" textAnchor="middle">Lobby entrance</text></svg>
 <ul><li>Open bedroom or bathroom doors with E or tap. Step clear while they swing.</li><li>Call the lift, step fully onto its platform, then choose Ride lift.</li><li>Use the stairs or lift to return to the lobby.</li></ul>
 <p className={styles.disclaimer}>Schematic interpretation, not an as-built plan. One demonstration floor is {residenceFloor} m above the lobby; higher storeys are exterior only. No real room assignments are shown.</p>
 <button className={styles.primary} onClick={close}>Return to walking</button></>;
}
