import { botsquad } from "@/content/site";

type Worker = { readonly name: string; readonly role: string; readonly body: string };

function WorkerCard({ worker }: { worker: Worker }) {
  return (
    <div className="squad-worker">
      <div><strong>{worker.name}</strong><span>{worker.role}</span></div>
      <p>{worker.body}</p>
    </div>
  );
}

/** Semantic reporting hierarchy, not a reconstruction of private application UI. */
export function WorkerFlow() {
  const team = botsquad.team;
  return (
    <figure className="squad-team" aria-label={team.headline}>
      <div className="squad-team__owner"><strong>{team.owner}</strong><span>{team.ownerRole}</span></div>
      <ul className="squad-team__root">
        <li>
          <WorkerCard worker={team.lead} />
          <ul className="squad-team__branches">
            {team.branches.map((worker) => (
              <li key={worker.name}>
                <WorkerCard worker={worker} />
                {worker.reports.length > 0 && (
                  <ul className="squad-team__reports">
                    {worker.reports.map((report) => <li key={report.name}><WorkerCard worker={report} /></li>)}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </li>
      </ul>
      <figcaption>{team.caption}</figcaption>
    </figure>
  );
}
