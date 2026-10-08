# BotSquad worker portraits

Date: October 7, 2026. Generated with the built-in image generation tool for the owner's request to add faces to the seven Meet BotSquad worker cards.

## References and intent

The owner supplied two illustrated portraits, named `ChatGPT Image Sep 5, 2026, 04_00_15 PM.png` and `ChatGPT Image Sep 5, 2026, 04_23_34 PM.png`. They are style references only. Neither source file is modified or published. The new portraits depict fictional AI-worker characters, not human staff, athletes, product screenshots or evidence of real-world employment. Their appearances do not add biographies or alter the workers' roles.

## Shared generation prompt

The following prompt was sent separately for each portrait, followed by its subject prompt below. Both supplied images were passed as style references. Opaque backgrounds were requested.

> Use case: stylized-concept. Asset type: one square illustrated headshot avatar for a BotSquad worker card. The two input images are STYLE REFERENCES ONLY, not edit targets and not identities to reproduce. Create one new fictional character. Match the references' sophisticated hand-drawn digital portrait style: crisp ink-like contours, angular cel-shaded planes with softly blended skin tones, detailed natural hair strands, realistic adult proportions and human warmth; not a photo, not 3D, not chibi. Soft warm stone/beige softly blurred background like the supplied references, identical visual family. Front-facing head and upper shoulders, direct gaze, centered symmetrical square 1:1 composition, entire hairstyle visible with comfortable 8% top/side margins. Face prominent and recognizable at small size; shoulder/chest crop at bottom. Even soft portrait lighting. Exactly one person. No text, letters, names, captions, logos, border, watermark, extra objects or hands.

## Subject prompts and outputs

Each generated source is 1254 × 1254 pixels. Final public assets are 384 × 384 WebP at quality 86, encoded with the existing Sharp dependency (effort 6); the complete square composition is retained without cropping or retouching. All seven together are 131,666 bytes. Full-resolution PNG originals are retained in the owner's local artifact folder, outside public assets.

### Atlas

> Atlas, a fictional male AI-worker character in his late 40s, warm medium skin, short swept-back dark hair with a little gray at the temples, square face, subtle trimmed stubble, no glasses, charcoal open-collar shirt and dark jacket, calm confident slight smile.

- Generated source: `exec-1352ace8-c621-4e53-af6e-1ac62e05380c.png`.
- Public asset: `public/images/botsquad/atlas.webp`.
- Alt text: “Illustrated portrait of Atlas, a BotSquad AI worker.”

### Maya

> Maya, a fictional female AI-worker character in her mid 30s, warm light-medium skin, straight shoulder-length black hair with a side part, softly angular face, black rectangular glasses, muted berry blouse and cream jacket, attentive friendly slight smile. A distinct invented person rather than a copy of the reference woman.

- Generated source: `exec-9de24f3a-7ed8-45a2-be4f-2597795ca3c4.png`.
- Public asset: `public/images/botsquad/maya.webp`.
- Alt text: “Illustrated portrait of Maya, a BotSquad AI worker.”

### Turing

> Turing, a fictional male AI-worker character in his early 40s, light olive skin, short dark curly hair, oval face, round dark eyeglasses, neatly trimmed beard, muted deep-teal open-collar shirt, thoughtful approachable slight smile.

- Generated source: `exec-561bbf21-7ac8-4e75-8f3f-d99a867d5559.png`.
- Public asset: `public/images/botsquad/turing.webp`.
- Alt text: “Illustrated portrait of Turing, a BotSquad AI worker.”

### Linus

> Linus, a fictional male AI-worker character in his early 30s, fair skin with a few subtle freckles, short tousled auburn hair, clean-shaven angular face, no glasses, graphite crewneck sweater, relaxed friendly expression.

- Generated source: `exec-ec9f396a-e581-426d-bde8-5262181a21de.png`.
- Public asset: `public/images/botsquad/linus.webp`.
- Alt text: “Illustrated portrait of Linus, a BotSquad AI worker.”

### Ada

> Ada, a fictional female AI-worker character in her early 30s, dark brown skin, softly rounded face, natural curly black hair gathered into a compact high puff fully inside the frame, no glasses, small simple stud earrings, muted teal blouse, open confident slight smile.

- Generated source: `exec-351775c0-a72a-4903-9bad-eb2de3d08af8.png`.
- Public asset: `public/images/botsquad/ada.webp`.
- Alt text: “Illustrated portrait of Ada, a BotSquad AI worker.”

### Grace

> Grace, a fictional female AI-worker character in her early 50s, warm medium-brown skin, short neat salt-and-pepper bob, thin dark eyeglasses, softly lined face, cream open-collar blouse and charcoal blazer, composed kindly slight smile.

- Generated source: `exec-61a482e7-31d2-4ab5-9e4f-2751f0e40e20.png`.
- Public asset: `public/images/botsquad/grace.webp`.
- Alt text: “Illustrated portrait of Grace, a BotSquad AI worker.”

### Scout

> Scout, a fictional androgynous adult AI-worker character in their late 20s, medium tan skin, short textured black hair, expressive brows, softly angular face, no glasses or facial hair, muted olive overshirt over a charcoal tee, alert curious friendly expression.

- Generated source: `exec-ca508a74-7469-4b79-aa59-b40d2ccaa658.png`.
- Public asset: `public/images/botsquad/scout.webp`.
- Alt text: “Illustrated portrait of Scout, a BotSquad AI worker.”

## Presentation and maintenance

`content/site.ts` owns each worker's portrait path, intrinsic dimensions and alt text. `WorkerFlow` uses Next.js Image with an 80px responsive image hint; CSS reserves a square beside the name and role within each existing worker card. The responsibility text remains below. The owner node receives no invented portrait. The Atlas → Maya/Turing/Scout and Turing → Linus/Ada/Grace hierarchy is unchanged.

Portraits use the reference artwork's warm neutral backgrounds inside the selected Graphite + Teal cards. No remote resources, new dependencies, animation or interaction is added. Keep the existing portrait set visually coherent, do not replace authentic Motion or sports media with generated faces, and update the asset manifest whenever a portrait changes.

