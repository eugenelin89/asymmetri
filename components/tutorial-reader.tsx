"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

type StepLink = { id: string; path?: "record" | "import"; view?: "back" | "side" };
type ModuleLink = { id: string; label: string; steps: StepLink[] };
function subscribeHash(listener: () => void) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}
const readHash = () => window.location.hash.slice(1);
const emptyHash = () => "";
const subscribeHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function TutorialReader({ modules, panels, headers }: {
  modules: ModuleLink[];
  panels: ReactNode[];
  headers: ReactNode[];
}) {
  const hash = useSyncExternalStore(subscribeHash, readHash, emptyHash);
  const ready = useSyncExternalStore(subscribeHydration, clientReady, serverReady);
  const [browseAll, setBrowseAll] = useState(false);
  const [path, setPath] = useState("all");
  const [view, setView] = useState("all");
  const found = modules.findIndex((module) => module.id === hash || module.steps.some((step) => step.id === hash));
  const active = found < 0 ? 0 : found;
  const current = modules[active];
  const linkedStep = current.steps.find((step) => step.id === hash);
  const all = !ready || browseAll;
  // An exact deep link always exposes its branch, even after another choice.
  const selectedPath = all ? "all" : linkedStep?.path ?? path;
  const selectedView = all ? "all" : linkedStep?.view ?? view;

  useEffect(() => {
    if (!ready || !hash || found < 0) return;
    const frame = requestAnimationFrame(() => {
      const destination = document.getElementById(hash);
      destination?.focus({ preventScroll: true });
      destination?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, ready, found]);

  function changeBranch(kind: "path" | "view", value: string) {
    if (kind === "path") setPath(value);
    else setView(value);
    if (linkedStep) window.location.assign(`#${current.id}`);
  }

  return (
    <div className="tutorial-reader shell" data-path={selectedPath} data-view={selectedView}>
      <aside className="tutorial-index">
        <nav aria-label="Tutorial modules">
          <p className="eyebrow">Your guide</p>
          <ol>
            {modules.map((module, index) => (
              <li key={module.id}>
                <a href={`#${module.id}`} aria-current={ready && !browseAll && index === active ? "step" : undefined}
                  onClick={() => setBrowseAll(false)}>
                  <span className="tutorial-index__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  {module.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {ready && <button className="tutorial-all" type="button" aria-pressed={browseAll}
          onClick={() => setBrowseAll(!browseAll)}>{browseAll ? "Return to guided view" : "Browse the complete guide"}</button>}
        <p className="tutorial-index__note">Jump freely. Your choices stay in this visit only.</p>
      </aside>
      <div className="tutorial-content">
        {ready && <div className="tutorial-progress" role="status" aria-live="polite">
          <span>{browseAll ? "Complete guide · 10 modules" : `Module ${active + 1} of ${modules.length}`}</span>
          <span>{browseAll ? "All paths and views" : current.label}</span>
        </div>}
        <noscript><p className="tutorial-note">The complete guide is shown below. Use the module links to jump to any section.</p></noscript>
        {modules.map((module, index) => (
          <section className="tutorial-module" id={module.id} key={module.id} tabIndex={-1}
            aria-labelledby={`${module.id}-title`} hidden={!all && index !== active}>
            {headers[index]}
        {ready && !browseAll && index === active && ["record-or-import", "set-up-the-pitch", "mark-the-moments", "analyze"].includes(current.id) &&
          <div className="tutorial-branches">
            {current.id === "record-or-import" && <fieldset>
              <legend>How are you starting?</legend>
              {[['all', 'Both paths'], ['record', 'Record Pitch'], ['import', 'Import Video']].map(([value, label]) =>
                <label key={value}><input type="radio" name="tutorial-path" value={value} checked={selectedPath === value}
                  onChange={() => changeBranch("path", value)} />{label}</label>)}
            </fieldset>}
            <fieldset>
              <legend>Which camera view?</legend>
              {[['all', 'Both views'], ['back', 'Back View'], ['side', 'Side View']].map(([value, label]) =>
                <label key={value}><input type="radio" name="tutorial-view" value={value} checked={selectedView === value}
                  onChange={() => changeBranch("view", value)} />{label}</label>)}
            </fieldset>
            <p>The steps below follow your choices. You can change them at any time.</p>
          </div>}
            {panels[index]}
            <nav className="tutorial-pagination" aria-label={`${module.label} module navigation`}>
              {index > 0 ? <a href={`#${modules[index - 1].id}`} onClick={() => setBrowseAll(false)}>
                <span>← Previous</span>{modules[index - 1].label}</a> : <span />}
              {index < modules.length - 1 ? <a href={`#${modules[index + 1].id}`} onClick={() => setBrowseAll(false)}>
                <span>Next →</span>{modules[index + 1].label}</a> : <a href="#start" onClick={() => setBrowseAll(false)}>
                <span>Back to the beginning ↑</span>Start</a>}
            </nav>
          </section>
        ))}
      </div>
    </div>
  );
}
