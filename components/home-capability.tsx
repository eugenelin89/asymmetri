import { labs } from "@/content/site";

export function HomeCapability() {
  return (
    <figure className="home-capability">
      <div className="home-capability__heading">
        <span>Small input</span>
        <span>Greater capability ↗</span>
      </div>
      <ul>
        {labs.diagram.tracks.map((track) => (
          <li key={track.product}>
            <p className="home-capability__input">{track.input}</p>
            <ul className="home-capability__steps">
              {track.steps.map((step) => <li key={step}>{step}</li>)}
            </ul>
            <p className="home-capability__output">{track.output}</p>
            <p className="home-capability__product">{track.product}</p>
          </li>
        ))}
      </ul>
      <figcaption>{labs.diagram.caption}</figcaption>
    </figure>
  );
}
