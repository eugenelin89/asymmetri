# BotSquad worker portraits

Dates: October 7–8, 2026. Generated with the built-in image generation tool for the owner's request to add faces to Meet BotSquad: the original seven workers, followed by Nix.

## References and intent

The owner supplied two illustrated portraits, named `ChatGPT Image Sep 5, 2026, 04_00_15 PM.png` and `ChatGPT Image Sep 5, 2026, 04_23_34 PM.png`. They are style references only. Neither source file is modified or published. The new portraits depict fictional AI-worker characters, not human staff, athletes, product screenshots or evidence of real-world employment. Their appearances do not add biographies or alter the workers' roles.

## Shared generation prompt

The following prompt was sent separately for each portrait, followed by its subject prompt below. Both supplied images were passed as style references. Opaque backgrounds were requested.

> Use case: stylized-concept. Asset type: one square illustrated headshot avatar for a BotSquad worker card. The two input images are STYLE REFERENCES ONLY, not edit targets and not identities to reproduce. Create one new fictional character. Match the references' sophisticated hand-drawn digital portrait style: crisp ink-like contours, angular cel-shaded planes with softly blended skin tones, detailed natural hair strands, realistic adult proportions and human warmth; not a photo, not 3D, not chibi. Soft warm stone/beige softly blurred background like the supplied references, identical visual family. Front-facing head and upper shoulders, direct gaze, centered symmetrical square 1:1 composition, entire hairstyle visible with comfortable 8% top/side margins. Face prominent and recognizable at small size; shoulder/chest crop at bottom. Even soft portrait lighting. Exactly one person. No text, letters, names, captions, logos, border, watermark, extra objects or hands.

## Subject prompts and outputs

Each generated source is 1254 × 1254 pixels. Final public assets are 384 × 384 WebP at quality 86, encoded with the existing Sharp dependency (effort 6); the complete square composition is retained without cropping or retouching. The original seven total 131,666 bytes; with Nix, all eight total 146,578 bytes. Full-resolution PNG originals are retained in the owner's local artifact folder, outside public assets.

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

### Nix — October 8 addition

The owner specified an Asian man in his early 20s, a short buzz cut, an earring,
a tattoo and a white T-shirt. These are character-design choices, not demographic
facts about a human employee. His DevOps role and direct reporting to Atlas come
from the public BotSquad implementation at `cb2fd43b8ffbec274df294f483d242a90385765e`
(`src/control/company.ts`, `initializeNix`, and `src/runtime/codex.ts`).

Generation used the shared prompt above followed by this initial subject prompt:

> Nix, a fictional androgynous adult AI-worker character in their early 30s, warm olive skin, short dark wavy hair with a subtle silver streak near the front, softly angular face, dark brown eyes, no glasses or facial hair, charcoal collared overshirt over a muted deep-teal crewneck, composed observant expression with a slight friendly smile. Distinctive but understated appearance that belongs alongside the existing BotSquad illustrated workers.

The built-in image tool then revised the same portrait as the owner refined the
character: male; Asian and early 20s; buzz cut; silver hoop and a small abstract
neck tattoo; finally a plain white T-shirt. Only the final version is public.
The source chain is retained for reproducibility:

1. Initial: `exec-9d0dd65f-6be0-4950-8464-146564be4140.png`.
2. Male revision: `exec-1bd00c0a-ded3-4b3f-8037-6830470e7e9b.png`.
3. Age and appearance: `exec-95fb7431-37a4-400d-a901-a5c9ab60d7c1.png`.
4. Buzz cut: `exec-14805a80-5571-4d3d-94eb-fb9425c196d7.png`.
5. Earring and tattoo: `exec-d565c1a7-6ba3-4c7a-bc9f-19359b1798f2.png`.
6. Final: `exec-fc8f3ad6-5359-4aec-8f46-e29b0ebeecc0.png`.

Final edit prompt, using the fifth image above as the sole edit target:

> Use case: precise-object-edit. Edit target: the supplied illustrated Nix portrait. Change ONLY his clothing: replace both the charcoal overshirt and teal undershirt with one plain white crew-neck T-shirt, no jacket or overshirt, no pattern or logo. Use natural soft light-gray cel shading in the white fabric. Preserve everything else exactly: Asian man in his early 20s, youthful clean-shaven face and identity, short black buzz cut, small silver hoop earring in his left ear (viewer right), small black fine-line geometric tattoo on the left side of his neck (viewer right), calm friendly slight smile, gaze and pose. Keep the same square centered head-and-shoulders framing, warm blurred beige background, crisp ink outlines and sophisticated angular cel-shaded illustration style. Do not remove, move or redesign the earring or tattoo. No text, logos, border or watermark. Opaque background.

- Public asset: `public/images/botsquad/nix.webp` (14,912 bytes).
- Alt text: “Illustrated portrait of Nix, a BotSquad AI worker.”
- Card: DevOps, “Coordinates worker infrastructure with human approval.”

## Presentation and maintenance

`content/site.ts` owns each worker's portrait path, intrinsic dimensions and alt text. `WorkerFlow` uses Next.js Image with an 80px responsive image hint; CSS reserves a square beside the name and role within each worker card. The responsibility text remains below. The owner node receives no invented portrait. Atlas has Maya/Turing/Scout/Nix as direct reports; Turing retains Linus/Ada/Grace. Four desktop branches become a nested single column at 1100px and below so portraits and labels remain readable.

Portraits use the reference artwork's warm neutral backgrounds inside the selected Graphite + Teal cards. No remote resources, new dependencies, animation or interaction is added. Keep the existing portrait set visually coherent, do not replace authentic Motion or sports media with generated faces, and update the asset manifest whenever a portrait changes.
