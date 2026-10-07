import { divisions, home, site } from "@/content/site";

export function HomeCapability() {
  return (
    <nav className="division-overview" aria-label="Asymmetri divisions">
      <p className="eyebrow">{home.divisionHeading}</p>
      <ul>
        {Object.entries(divisions).map(([key, division], index) => (
          <li className={`division-overview__${key}`} key={division.path}>
            <span className="division-overview__number" aria-hidden="true">0{index + 1}</span>
            <div>
              <h2>
                <a href={division.path}>
                  <span><span className="division-overview__parent">{site.company.name} </span>{division.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </h2>
              <p>{division.description}</p>
              <a className="text-link" href={division.product.path}>{division.product.name} →</a>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
