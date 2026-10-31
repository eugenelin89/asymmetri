"use client";
import {
  appearanceOptions,
  defaultAppearance,
  type Appearance,
} from "./appearance";
import styles from "./campus.module.css";
const labels: Record<keyof Appearance, string> = {
  presentation: "Gender presentation",
  skin: "Skin tone",
  hair: "Hair colour",
  hairstyle: "Hair style",
  outfit: "Clothing",
  shirt: "Clothing colour",
  trousers: "Trouser colour",
  footwear: "Shoes",
  shoes: "Shoe colour",
};
export function AppearancePanel({
  value,
  onChange,
  onPreview,
}: {
  value: Appearance;
  onChange: (v: Appearance) => void;
  onPreview: () => void;
}) {
  return (
    <>
      <h2>Your appearance.</h2>
      <p>
        Choose how you look. Saved on this device only. Every option is
        available with every gender presentation.
      </p>
      <div
        className={styles.appearancePreview}
        aria-label="Avatar colour preview"
      >
        <span style={{ background: value.hair }}>Hair</span>
        <span style={{ background: value.skin }}>Skin</span>
        <span style={{ background: value.shirt }}>Clothing</span>
        <span style={{ background: value.shoes }}>Shoes</span>
      </div>
      {Object.entries(appearanceOptions).map(([key, options]) => (
        <label className={styles.appearanceField} key={key}>
          {labels[key as keyof Appearance]}
          <select
            value={value[key as keyof Appearance]}
            onChange={(e) => onChange({ ...value, [key]: e.target.value })}
          >
            {options.map((option, i) => (
              <option value={option} key={option}>
                {option.startsWith("#")
                  ? `${labels[key as keyof Appearance]} ${i + 1} · ${option}`
                  : option}
              </option>
            ))}
          </select>
        </label>
      ))}
      <div className={styles.links}>
        <button onClick={onPreview}>See myself in third person</button>
        <button onClick={() => onChange({ ...defaultAppearance })}>
          Reset appearance
        </button>
      </div>
      <p>This does not publish a profile or change anyone else’s character.</p>
    </>
  );
}
