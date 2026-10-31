import { transportData, detourMission } from "./transport";
import { missingLeads, missingClues, missingWitnesses, type missingLocations } from "./missing";
import { evidence, witnesses, type StoryPoint } from "./story";
import type { Point, Snapshot } from "./types";
import styles from "./surrey.module.css";
export function Journal({ state, locations, missingPoints, close, track }: { state: Snapshot; locations: Record<StoryPoint, Point>; missingPoints: ReturnType<typeof missingLocations>; close(): void; track(p: Point, name: string): void }) {
  const m = state.investigation;
  const leads = [
    { id: "scene" as const, name: "Sealed scene · review / submit theory", hint: "Look around the sealed case for a tagged parcel." },
    ...(m.stage !== "available" ? [{ id: "nina" as const, name: "Nina · first witness", hint: "West of the scene; ask about the chime." }] : []),
    ...(m.witnesses.includes("nina") ? [{ id: "idris" as const, name: "Idris · dispatch kiosk", hint: "Ask about the carts. Search around the nearby bench." }, { id: "clock" as const, name: "Jo’s meeting area · clock records", hint: "Look near the community meeting point for a maintenance log." }] : []),
    ...(m.witnesses.includes("idris") ? [{ id: "rowan" as const, name: "Rowan · the artist", hint: "Ask about the red cloth, then examine the area around the artist." }] : []),
  ];
  return <div className={styles.journal} role="dialog" aria-modal="true" aria-label="Mission journal and evidence">
    <div className={styles.journalHeading}><div><span className={styles.eyebrow}>YOUR CITY NOTEBOOK</span><h2>Cases & conversations</h2></div><button onClick={close} autoFocus aria-label="Close journal">×</button></div>
    <div className={styles.journalColumns}>
      <section><h3>05 · The Long Way Around</h3><p>{state.detour.stage === "closed" ? "Complete · Mina has the community archive. Reward $85. The fictional workzone has cleared." : state.detour.stage === "available" ? "Nora needs an community archive delivered to Mina near Central City. Meet Nora on foot by the station. Fictional roadwork will close part of University Drive, so plan another way around." : state.detour.stage === "arrived" ? "Stop, exit and hand the community archive to Mina beside the Central City roadside stop." : "Follow your GPS around the fictional University Drive closure, or find another validated route. Stop near Central City, exit and meet Mina. The job and kit survive reloads and recovery."}</p>
        <div className={styles.lead}><button onClick={()=>track(detourMission.giver,"Nora · community archive")}>Find Nora</button> <button onClick={()=>track(detourMission.recipient,"Mina · archive delivery")}>Find Mina</button></div>
        <h3>04 · A Ride Across Surrey</h3><p>{state.delivery.stage === "closed" ? "Complete · Quinn has the projector. Reward $55. The car remains available for free driving." : state.delivery.stage === "available" ? "Meet Jules by the station. A community film night needs its projector. The teal car is available even before taking the job." : state.delivery.stage === "arrived" ? "Park, exit and hand the projector to Quinn beside the marked destination." : "Enter the teal car, follow Central Avenue east, turn left onto City Parkway and stop at the cyan drop-off. Exit to deliver. Recovery and reload preserve this job."}</p>
        <div className={styles.lead}><button onClick={()=>track(transportData.giver,"Jules · delivery request")}>Find Jules</button> <button onClick={()=>track([state.vehicle.car.x,state.vehicle.car.z],"Community car")}>Find my car</button> <button onClick={()=>track(transportData.recipient,"Quinn · projector delivery")}>Find Quinn</button></div>
        <p className={styles.journalNote}>Drive freely on the pale validated roads. Map & GPS offers eight roadside destinations and Clear Route. Gold guidance follows your selected destination; cyan marks Case 04. Brake before corners and use E only when stopped. Signals share a simplified fictional cycle. SkyTrain is moving scenery; boarding is not available.</p>
        <h3>03 · The Missing Person</h3><p>{state.missing.stage === "available" ? "Tess has a request near the station. An adult friend missed a check-in." : state.missing.stage === "closed" ? `Closed · ${state.missing.ending === "message" ? "Riley’s privacy respected" : "Reunion agreed by Riley"}. Reward $${state.missing.reward}.` : state.missing.stage === "return" ? "Return to Tess and relay Riley’s wishes." : `Approach: ${state.missing.approach === "people" ? "two witness accounts and at least one clue" : "two clues and at least one witness account"}. The red van sighting needs corroboration.`}</p>
        {missingLeads(state.missing).map(lead => <div key={lead.id} className={styles.lead}><strong>{lead.name}</strong><p>{lead.hint}</p><button onClick={() => track(missingPoints[lead.id as keyof typeof missingPoints], lead.name)}>Pin this lead</button></div>)}
        <h3>01 · Welcome to Surrey</h3><p>{state.stage === "completed" ? "Closed · Alex has the backpack. Reward received." : state.stage === "available" ? "Meet Alex by the gold station marker to begin the backpack case." : state.objective}</p>
        <h3>02 · The Surrey Central Mystery</h3><p>{m.stage === "available" ? "Discover the sealed case at the purple map marker. All people and incidents in this investigation are fictional." : m.stage === "closed" ? "Closed · The cart, clock and witness accounts agree." : "The watch reads 13:13. Establish the real time, trace C17 and check the red cloth before deciding. Look for small objects on the ground; E inspects them nearby."}</p>
        {m.conclusion && <p className={styles.journalNote}>{m.conclusion}</p>}
        <h4>Leads you know</h4><p className={styles.journalNote}>Pins mark people or search areas. Hidden evidence is not exposed from the air. Return to the sealed scene to submit your theory.</p>
        {leads.map(lead => <div key={lead.id} className={styles.lead}><strong>{lead.name}</strong><p>{lead.hint}</p><button onClick={() => track(lead.id === "clock" ? [locations.clock[0] + 7, locations.clock[1] - 3] : locations[lead.id], lead.name)}>Pin this lead</button></div>)}
      </section>
      <section><h3>Case 03 · notes</h3>{missingClues.filter(c => state.missing.clues.includes(c.id)).map(c => <div className={styles.lead} key={c.id}><strong>{c.name}</strong><p>{c.text}</p></div>)}
        {missingWitnesses.filter(w => state.missing.witnesses.includes(w.id)).map(w => <div className={styles.lead} key={w.id}><strong>{w.name}</strong><p>{w.text}</p></div>)}
        <h3>Evidence · {m.evidence.length} collected</h3>{m.evidence.length ? evidence.filter(e => m.evidence.includes(e.id)).map(e => <div className={styles.lead} key={e.id}><strong>{e.name}</strong><p>{e.text}</p></div>) : <p>No evidence recorded yet.</p>}
        <h3>Witness accounts</h3>{witnesses.filter(w => m.witnesses.includes(w.id)).map(w => <div className={styles.lead} key={w.id}><strong>{w.name}</strong><p>{w.text}</p></div>)}
        <h3>In your pockets</h3><ul>{state.inventory.length ? state.inventory.map(item => <li key={item}>{item}</li>) : <li>Room for a story.</li>}</ul>
        <h3>Street stories</h3><p>{state.resolved.length} different encounters resolved. Repeat encounters never pay another reward.</p>
      </section>
    </div>
  </div>;
}
