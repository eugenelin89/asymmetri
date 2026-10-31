import { useId } from "react";
import styles from "./campus.module.css";

/** Original Stanford-inspired illustration. The 3D world uses mapped geography. */
export function HalloweenWelcome({ night = true }: { night?: boolean }) {
  const id = useId().replaceAll(":", "");
  const stone = night ? "#9a937f" : "#d7b98d";
  const shade = night ? "#526761" : "#bda075";
  const roof = night ? "#7a5148" : "#b75e43";
  const arch = night ? "#233a3e" : "#635448";
  return <svg className={styles.halloweenArt} viewBox="0 0 760 780" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id={`${id}-orb`}><stop stopColor={night ? "#fff5d2" : "#ffe7ae"} /><stop offset="1" stopColor={night ? "#bfcabe" : "#eabe7c"} /></radialGradient>
      <linearGradient id={`${id}-hill`} x2="0" y2="1"><stop stopColor={night ? "#435d52" : "#8c9c6e"} /><stop offset="1" stopColor={night ? "#182d2d" : "#62764f"} /></linearGradient>
      <linearGradient id={`${id}-mist`}><stop stopColor="#ced6c7" stopOpacity="0" /><stop offset=".6" stopColor="#ced6c7" stopOpacity=".2" /><stop offset="1" stopColor="#ced6c7" stopOpacity="0" /></linearGradient>
      <g id={`${id}-palm`}><path d="M0 0Q-6-74 3-156" stroke={night ? "#354744" : "#786752"} strokeWidth="10" /><g stroke={night ? "#233b36" : "#425c3b"} strokeWidth="8" strokeLinecap="round"><path d="M3-156Q-42-180-66-130M3-156Q50-183 68-130M3-156Q-28-204-47-169M3-156Q34-205 50-166M3-156Q0-207 7-215M3-156Q-21-159-26-118M3-156Q24-157 30-119" /></g></g>
      <g id={`${id}-pumpkin`}><path d="M0-19-2-30 5-33" stroke="#8c8d55" strokeWidth="5" /><ellipse rx="25" ry="21" fill="#cd7939" /><ellipse rx="15" ry="21" stroke="#8a4e36" /><path d="m-17-4 9-9 4 10Zm21 1 3-10 10 9ZM-15 7-5 12 0 8 6 12 16 5Q9 22 0 19Q-11 20-15 7" fill="#ffe2a0" /></g>
    </defs>
    <circle cx="495" cy="183" r="114" fill={`url(#${id}-orb)`} opacity={night ? .96 : .72} />
    {night && <g fill="#ebecd0">{Array.from({length:22},(_,i)=><circle key={i} cx={100+(i*137)%610} cy={45+(i*73)%280} r={i%4===0?1.8:1} opacity=".7" />)}</g>}
    <path d="M0 425 115 354 216 384 321 324 447 366 530 310 760 405V780H0" fill={`url(#${id}-hill)`} />
    {/* Hoover Tower: shaft, paired belvedere openings, stepped crown. */}
    <g><path d="M559 456V212H608V456" fill={stone} /><path d="M608 456V212L624 218V456" fill={shade} /><path d="M553 216V192H615V216" fill={stone} /><path d="M563 191V178H605V191L584 159Z" fill={roof} /><path d="M553 218H617" stroke={shade} strokeWidth="5" />{[564,584,604].map(x=><path key={x} d={`M${x} 208v-15q5-12 10 0v15Z`} fill={arch} />)}{[250,284,318,352].map(y=><path key={y} d={`M580 ${y}v-11q4-5 8 0v11Z`} fill={arch} />)}</g>
    {/* Main Quad arcades and the Memorial Church façade. */}
    <g fill={stone} stroke={shade} strokeWidth="1"><path d="M155 438H683V535H155Z" /><path d="M144 438 170 411H668L695 438Z" fill={roof} />{Array.from({length:17},(_,i)=>i).filter(i=>i<6||i>10).map(i=><path key={i} d={`M${166+i*30} 532v-49q11-22 22 0v49Z`} fill={arch} />)}
    <path d="M338 535V379L410 330 480 379V535Z" fill={stone} /><path d="m331 379 79-56 78 56-7 7-71-48-72 48Z" fill={roof} /><path d="M351 395H467V452H351Z" fill={night ? "#b59d6f" : "#d3ac63"} />
    {Array.from({length:32},(_,i)=><rect key={i} x={355+(i%8)*14} y={400+Math.floor(i/8)*12} width="10" height="9" fill={["#987c60","#bdb69b","#708c87","#d4bc7e"][i%4]} opacity=".7" />)}
    {[365,398,431].map(x=><path key={x} d={`M${x} 535v-45q12-24 24 0v45Z`} fill={arch} />)}<circle cx="410" cy="368" r="12" fill={arch} /><path d="M410 356v24M398 368h24" stroke={stone} strokeWidth="2" /><path d="M332 455H488M332 459H488" stroke={shade} strokeWidth="3" />
    </g>
    <path d="M0 556Q345 524 760 551V780H0" fill={night ? "#243d32" : "#77945c"} />
    <path d="m395 535-161 245H618L424 535Z" fill={night ? "#67766b" : "#d1c3a7"} />
    {[{x:173,y:584,s:.7},{x:638,y:572,s:.72},{x:113,y:660,s:1.15},{x:690,y:696,s:1.3},{x:39,y:788,s:1.9}].map((p,i)=><use key={i} href={`#${id}-palm`} transform={`translate(${p.x} ${p.y}) scale(${p.s})`} />)}
    {night && <><path className={styles.welcomeMist} d="M0 592Q190 551 342 583T760 557V606Q539 626 376 610T0 643ZM0 720Q204 678 384 711T760 680V752H0Z" fill={`url(#${id}-mist)`} /><g className={styles.welcomeGhost} transform="translate(526 588)"><path d="M-24 12V-20Q-24-55 0-54Q25-55 25-20V12L37 26 18 22 7 35-8 24-25 34-32 22Z" fill="#d7e5d8" opacity=".75" /><ellipse cx="-8" cy="-21" rx="3" ry="7" fill="#324a46" /><ellipse cx="8" cy="-21" rx="3" ry="7" fill="#324a46" /></g><g className={styles.welcomeBats} fill="#15292e">{[0,1,2].map(i=><path key={i} transform={`translate(${315+i*76} ${145+i*43}) scale(${.7+i*.15})`} d="M-25 0Q-15-17-5-7L0-13 5-7Q17-17 25 0Q13-5 12 8L0 2-12 8Q-13-5-25 0" />)}</g><use href={`#${id}-pumpkin`} transform="translate(245 695) scale(1.4)" /><use href={`#${id}-pumpkin`} transform="translate(292 714)" /><use href={`#${id}-pumpkin`} transform="translate(593 653) scale(.85)" /></>}
    <path d="M0 762Q130 724 233 754T491 754Q667 728 760 755V780H0Z" fill={night ? "#14292a" : "#4a6548"} />
  </svg>;
}
