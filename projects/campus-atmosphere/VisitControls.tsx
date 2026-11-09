import type { useCampusVisit } from "./use-campus-visit";
import { campusDate, clock, type Campus } from "./calendar";
import { ubc } from "@/content/site";
import styles from "./visit.module.css";

type Visit = ReturnType<typeof useCampusVisit>;

const editionNames = { regular: "Regular", halloween: "Halloween", christmas: "Christmas" };
const weatherNames = { neutral: "Neutral sky", clear: "Clear", cloudy: "Partly cloudy", overcast: "Overcast", rain: "Rain", fog: "Fog", snow: "Snow" };
const campusNames = { ubc: "Vancouver", cwru: "Cleveland", stanford: "Stanford" };

export function EditionControl({ visit }: { visit: Visit }) {
  return (
    <div className={styles.edition}>
      <label>Campus edition
        <select value={visit.replay ?? visit.choice} onChange={event => visit.select(event.target.value as Parameters<Visit["select"]>[0])}>
          <option value="automatic">Automatic</option>
          <option value="regular">Regular</option>
          <optgroup label="Replay for this visit">
            <option value="christmas">Replay Christmas</option>
            <option value="halloween">Replay Halloween</option>
          </optgroup>
        </select>
      </label>
      <span role="status">{editionNames[visit.edition]} {visit.replay ? "replay" : "edition"}</span>
      {visit.replay && <button type="button" onClick={visit.endReplay}>End replay</button>}
    </div>
  );
}

export function CampusConditions({ visit, campus }: { visit: Visit; campus: Campus }) {
  const weather = visit.live ? visit.observation?.condition : weatherNames[visit.atmosphere.weather];
  return <>{visit.live ? "Live" : "Simulated"} · {clock(visit.atmosphere.hour)} {campusNames[campus]} · {weather || "Weather unavailable."}</>;
}

function ModeControl({ visit }: { visit: Visit }) {
  return <label>Atmosphere
    <select value={visit.live ? "live" : "simulated"} onChange={event => event.target.value === "live" ? visit.returnLive() : visit.stage({})}>
      <option value="live">Live</option>
      <option value="simulated">Simulated</option>
    </select>
  </label>;
}

function StagingControls({ visit, photo }: { visit: Visit; photo?: boolean }) {
  const { atmosphere, stage } = visit;
  const prefix = photo ? "Photo " : "";
  return <>
    <ModeControl visit={visit} />
    <label>Time <output>{clock(atmosphere.hour)}</output>
      <input aria-label={photo ? "Photo time" : "Time of day"} type="range" min="0" max="23.75" step=".25" value={atmosphere.hour}
        onChange={event => stage({ hour: Number(event.target.value) })} />
    </label>
    <label>Season
      <select aria-label={prefix + "season"} value={atmosphere.season} onChange={event => stage({ season: event.target.value as typeof atmosphere.season })}>
        {["spring", "summer", "autumn", "winter"].map(season => <option key={season}>{season}</option>)}
      </select>
    </label>
    <label>Weather
      <select aria-label={prefix + "weather"} value={atmosphere.weather}
        onChange={event => stage({ weather: event.target.value as typeof atmosphere.weather })}>
        {Object.entries(weatherNames).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
      </select>
    </label>
  </>;
}

export function PhotoAtmosphere({ visit }: { visit: Visit }) {
  return <StagingControls visit={visit} photo />;
}

export function AtmospherePanel({ visit, campus }: { visit: Visit; campus: Campus }) {
  const { solar } = visit.atmosphere;
  const { observation } = visit;
  const date = campusDate(campus, visit.now).date;
  const observed = observation ? new Date(observation.observedAt) : null;
  const local = observed && campusDate(campus, observed);
  return <>
    <h2>Atmosphere</h2>
    <EditionControl visit={visit} />
    <p>{date} in {campusNames[campus]} · {visit.live ? "Live atmosphere" : "Simulated atmosphere"}</p>
    <fieldset>
      <legend>Nearby weather</legend>
      {observation && observed && local ? <>
        <strong>{observation.condition}</strong>
        <p>{observation.provider} · Nearby station: {observation.station}</p>
        <p><time dateTime={observation.observedAt}>{local.date} {clock(local.hour)}</time> local · {Math.max(0, Math.floor((visit.now.getTime() - observed.getTime()) / 60000))} min ago{visit.cached && " · Cached observation"}</p>
        {campus === "ubc" && <a href={ubc.weatherLicence.href} target="_blank" rel="noopener noreferrer">{ubc.weatherLicence.label} ↗</a>}
      </> : <p>Weather unavailable.</p>}
    </fieldset>
    <fieldset>
      <legend>Light and weather</legend>
      <StagingControls visit={visit} />
      {!visit.live && <p>Simulated sunlight for {solar.date}.</p>}
      <p>First light {clock(solar.dawn)} · Sunrise {clock(solar.sunrise)}<br />
        Sunset {clock(solar.sunset)} · Last light {clock(solar.dusk)}</p>
      <div className={styles.presets}>
        <button onClick={() => visit.stage({ hour: solar.sunrise + 0.3 })}>Sunrise</button>
        <button onClick={() => visit.stage({ hour: 12 })}>Midday</button>
        <button onClick={() => visit.stage({ hour: solar.sunset - 0.7 })}>Golden hour</button>
        <button onClick={() => visit.stage({ hour: 22 })}>Night</button>
        {visit.edition === "halloween" && <button onClick={() => visit.stage({ season: "autumn", weather: "overcast", hour: 19.5 })}>Halloween evening · 19:30 overcast</button>}
      </div>
    </fieldset>
  </>;
}

export function SoundControl({ enabled, onChange }: { enabled: boolean; onChange: (enabled: boolean) => void }) {
  return <label className={styles.sound}><input type="checkbox" checked={enabled} onChange={event => onChange(event.target.checked)} /> Campus sound</label>;
}

export function SoundVolume({ volume, onChange }: { volume: number; onChange: (volume: number) => void }) {
  return <label>Sound volume <output>{Math.round(volume * 100)}%</output>
    <input type="range" min="0" max="100" step="1" aria-label="Sound volume" value={Math.round(volume * 100)} onChange={event => onChange(Number(event.target.value) / 100)} />
  </label>;
}
