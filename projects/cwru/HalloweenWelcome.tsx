import { useId } from "react";
import styles from "./campus.module.css";

/** Original decorative campus illustration, not a measured architectural view. */
export function HalloweenWelcome() {
  const id = useId().replaceAll(":", "");
  return (
    <svg className={styles.halloweenArt} viewBox="0 0 760 780" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-moon`} cx="35%" cy="28%" r="75%">
          <stop stopColor="#fff7dc" /><stop offset=".65" stopColor="#dfd6bb" /><stop offset="1" stopColor="#a6b2aa" />
        </radialGradient>
        <radialGradient id={`${id}-halo`}><stop stopColor="#d9dcbd" stopOpacity=".15" /><stop offset="1" stopColor="#d9dcbd" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}-mist`} x2="1" y2="0"><stop stopColor="#8faaa4" stopOpacity="0" /><stop offset=".55" stopColor="#8faaa4" stopOpacity=".19" /><stop offset="1" stopColor="#8faaa4" stopOpacity="0" /></linearGradient>
        <linearGradient id={`${id}-ghost`} x2=".5" y2="1"><stop stopColor="#f3efda" stopOpacity=".8" /><stop offset="1" stopColor="#d8eadc" stopOpacity=".04" /></linearGradient>
        <linearGradient id={`${id}-pumpkin-fill`} x2="1" y2="1"><stop stopColor="#e19a47" /><stop offset="1" stopColor="#713721" /></linearGradient>
        <g id={`${id}-bat`}><path d="M-30 1Q-21-15-7-8L-4-14 0-9 4-14 7-8Q21-15 30 1Q18-4 15 8Q7 1 0 13Q-7 1-15 8Q-18-4-30 1Z" fill="#142326" /></g>
        <g id={`${id}-window`} fill="#e9bb71"><path d="M0 16V5L5 0 10 5V16Z" /><path d="M5 1V16M0 8H10" stroke="#23322d" strokeWidth="1.5" /></g>
        <g id={`${id}-pumpkin`}>
          <path d="M-3-21Q-6-34 5-37L8-32Q1-29 3-20" fill="#73806a" />
          <ellipse rx="31" ry="25" fill={`url(#${id}-pumpkin-fill)`} />
          <ellipse rx="19" ry="25" stroke="#6d3826" strokeOpacity=".55" />
          <ellipse rx="8" ry="25" stroke="#efb362" strokeOpacity=".24" />
          <path d="M-22-3-10-14-7-2ZM7-2 11-14 23-3ZM-19 7-9 11-5 8 0 13 7 9 10 11 19 6Q11 23 0 21Q-12 20-19 7Z" fill="#ffe1a0" />
        </g>
      </defs>
      <circle cx="456" cy="220" r="270" fill={`url(#${id}-halo)`} />
      <g fill="#dae4cd" opacity=".55">
        <circle cx="157" cy="139" r="1.4" /><circle cx="630" cy="90" r="1.5" /><circle cx="664" cy="293" r="1" /><circle cx="294" cy="80" r="1" /><circle cx="215" cy="298" r="1" />
        <path d="m567 57 2 7 7 2-7 2-2 7-2-7-7-2 7-2ZM237 182l1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5 5-1.5Z" />
      </g>
      <circle cx="456" cy="220" r="105" fill={`url(#${id}-moon)`} />
      <g fill="#71877e" opacity=".13"><ellipse cx="413" cy="183" rx="24" ry="33" /><ellipse cx="470" cy="257" rx="37" ry="26" /><circle cx="499" cy="174" r="15" /><circle cx="404" cy="247" r="12" /><circle cx="474" cy="203" r="9" /></g>
      <path d="M191 252Q281 221 329 244T456 247Q516 220 607 247T758 232V263H191Z" fill="#132429" opacity=".48" />
      <path d="M299 154Q361 134 422 155T564 149Q607 141 647 156V172H299Z" fill="#223438" opacity=".42" />
      <g className={styles.welcomeBats}>
        <use href={`#${id}-bat`} transform="translate(551 301) rotate(-17) scale(.8)" />
        <use href={`#${id}-bat`} transform="translate(604 252) rotate(18) scale(.52)" />
        <use href={`#${id}-bat`} transform="translate(329 171) rotate(-12) scale(.46)" />
      </g>
      <path d="M0 586Q125 513 260 544T496 531Q651 486 760 522V780H0Z" fill="#172d2c" />
      <g fill="#102123" stroke="#799087" strokeOpacity=".25" strokeWidth="1.5">
        <path d="M237 550V423H361V550ZM484 550V423H660V550Z" />
        <path d="m221 424 33-47h92l25 47Zm254 0 25-47h137l39 47Z" fill="#1e3332" />
        <path d="M355 553V346H486V553Z" /><path d="m344 347 76-68 78 68Z" fill="#213738" />
        <path d="M349 360V322H360V309H370V322H382V309H393V322H405V309H416V322H428V309H439V322H451V309H462V322H474V309H485V322H495V360Z" fill="#2b4140" />
        <path d="M340 550V378H354V550ZM488 550V378H502V550ZM224 551V423H237V551ZM661 551V423H674V551Z" />
        <path d="M352 520H487M352 411H487M238 476H353M500 476H660" />
        <path d="M392 553V496Q392 470 420 453Q449 470 449 496V553Z" fill="#070f15" />
        <path d="M399 552V497Q399 478 420 463Q442 478 442 497V552" stroke="#dba66b" strokeOpacity=".3" />
      </g>
      <g opacity=".84">
        {[259, 293, 327, 522, 556, 590, 624].map((x) => <use key={x} href={`#${id}-window`} transform={`translate(${x} 441) scale(1.3)`} />)}
        {[259, 293, 327, 522, 556, 590, 624].map((x) => <use key={x} href={`#${id}-window`} transform={`translate(${x} 493) scale(1.3)`} />)}
        {[378, 410, 442].map((x) => <use key={x} href={`#${id}-window`} transform={`translate(${x} 375) scale(1.5)`} />)}
      </g>
      <path d="M412 553Q378 612 278 672T197 780H657Q546 688 488 647T429 553Z" fill="#4f6159" opacity=".3" />
      <path d="M424 556Q403 626 364 660" stroke="#d3b576" opacity=".2" />
      <g stroke="#091a1e" strokeLinecap="round" fill="none">
        <path d="M127 682Q165 495 117 302Q96 245 101 169M140 479Q227 417 242 351M131 396Q56 369 17 282M119 324Q166 273 178 216" strokeWidth="15" />
        <path d="M101 212 55 172 36 121M105 267 61 235M174 446 176 390 157 360M211 403 269 394M69 361 61 313 37 304M159 274 154 239 129 214M176 229 205 209" strokeWidth="5" />
        <path d="M731 691Q683 499 716 337Q738 259 735 167M701 437Q638 396 621 347M713 350Q662 300 657 248M734 226 687 196" strokeWidth="13" />
        <path d="M669 416 670 363M693 327 716 294M658 264 634 247M732 193 757 158" strokeWidth="4" />
      </g>
      <path className={styles.welcomeMist} d="M40 562Q179 516 305 559T565 551Q680 523 780 559V606Q630 578 504 607T245 595Q113 613 0 586ZM12 673Q206 627 353 666T690 649L780 704Q600 665 435 712T31 708Z" fill={`url(#${id}-mist)`} />
      <g className={styles.welcomeGhost} transform="translate(562 557)">
        <path d="M-29 10Q-30-43 0-44Q32-43 31-10Q32 14 50 25Q33 36 18 27Q7 44-6 28Q-19 43-38 30Q-27 24-29 10Z" fill={`url(#${id}-ghost)`} />
        <ellipse cx="-9" cy="-15" rx="4" ry="7" fill="#243e3d" /><ellipse cx="9" cy="-15" rx="4" ry="7" fill="#243e3d" />
      </g>
      <g fill="#c7864d" opacity=".68"><path d="m196 459 11 3-7 10-11-3ZM604 614l13 3-10 8-9-4ZM284 735l15-3-3 11-13 3ZM87 529l13 2-9 8-8-3Z" /></g>
      <use href={`#${id}-pumpkin`} transform="translate(235 686) rotate(-8) scale(1.3)" />
      <use href={`#${id}-pumpkin`} transform="translate(286 701) rotate(9) scale(.82)" />
      <use href={`#${id}-pumpkin`} transform="translate(660 653) rotate(6) scale(.65)" />
      <path d="M0 757Q129 708 190 735T338 748Q484 724 552 747T760 715V780H0Z" fill="#0d1e21" />
    </svg>
  );
}
