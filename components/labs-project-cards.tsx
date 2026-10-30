import type { LabsProject } from "@/content/site";

export function LabsProjectCards({ projects }: { projects: readonly LabsProject[] }) {
  return (
    <div className="labs-projects">
      {projects.map((project) => (
        <article className="labs-product__card" key={project.name}>
          <h3>{project.name}</h3>
          <p className="product-lead">{project.description}</p>
          <p className="showcase-status">{project.status}</p>
          {project.license && (
            <a className="text-link" href={project.license.href}>
              {project.license.label} ↗
            </a>
          )}
          <div className="button-row">
            {project.detail && (
              <a className="button button--primary" href={project.detail.href}>
                {project.detail.label} →
              </a>
            )}
            {project.source && (
              <a className="text-link" href={project.source.href}>
                {project.source.label} ↗
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
