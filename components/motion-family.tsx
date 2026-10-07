import { motionFamily, productStatusLabels, type MotionFamilyProduct } from "@/content/site";

function FamilyProduct({ product }: { product: MotionFamilyProduct }) {
  return (
    <div className="motion-family__product" id={`family-${product.id}`}>
      <div className="motion-family__product-heading">
        <h4>{product.name}</h4>
        <span className="product-state">{productStatusLabels[product.status]}</span>
      </div>
      <p>{product.description}</p>
      <p className="product-note">{product.detail}</p>
      {product.link && <a className="text-link" href={product.link.href}>{product.link.label} →</a>}
    </div>
  );
}

export function MotionFamily() {
  return (
    <section className="section motion-family" id="motion-family" tabIndex={-1} aria-labelledby="motion-family-title">
      <div className="shell">
        <div className="product-split">
          <div className="product-heading">
            <p className="eyebrow">{motionFamily.name}</p>
            <h2 id="motion-family-title">{motionFamily.headline}</h2>
          </div>
          <p className="product-lead">{motionFamily.introduction}</p>
        </div>
        <div className="motion-family__groups">
          <div>
            <header className="motion-family__group-heading">
              <h3>{motionFamily.individual.label}</h3>
              <p>{motionFamily.individual.description}</p>
            </header>
            {motionFamily.individual.products.map((product) => <FamilyProduct key={product.id} product={product} />)}
          </div>
          <div>
            <header className="motion-family__group-heading">
              <h3>{motionFamily.professional.label}</h3>
              <p>{motionFamily.professional.description}</p>
            </header>
            <FamilyProduct product={motionFamily.professional.product} />
            <dl className="motion-family__entitlements" aria-label="Entitlements within the Team app">
              {motionFamily.professional.entitlements.map((entitlement) => (
                <div key={entitlement.name}><dt>{entitlement.name}</dt><dd>{entitlement.description}</dd></div>
              ))}
            </dl>
            <p className="product-note">{motionFamily.professional.continuity}</p>
            <p className="product-note">{motionFamily.professional.cloud}</p>
          </div>
        </div>
        <div className="motion-family__future">
          <h3>{motionFamily.future.title}</h3>
          <p>{motionFamily.future.body}</p>
        </div>
        <p className="product-note">{motionFamily.note}</p>
      </div>
    </section>
  );
}
