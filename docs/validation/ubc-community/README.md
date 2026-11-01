# Campus community validation

These are real browser captures of the isolated local application on October 31, 2026. They are not production deployment evidence. The review cards contain explicitly labeled synthetic local fixtures; no test review was published to the live website. Desktop and mobile here describe viewport emulation, not physical-device tests.

- [Student encounter](student-conversation.jpg): 1280×720; an unlabeled encounter introduces Anton Afanassiev naturally and offers study/source follow-ups. The scene and cosmetic character are original procedural geometry, not a likeness.
- [Review cards](reviews-desktop.jpg): 1280×720; synthetic test ratings, distribution and cards. Development chrome may appear.
- [Phone review form](reviews-mobile-form.jpg): 390×844; chosen public name, 1–5 stars and optional comments.
- [Phone privacy controls](privacy-mobile.jpg): 390×844; production-build rendering of the notice, opt-out and history-removal controls. The page explains the private records and their limits.

Final TypeScript/ESLint checks, 592 automated tests and the production dependency audit passed. The Next prebuild covered seven suites totaling 511 tests; Vancouver and investment regression suites added 81. Next and Vinext builds passed. Backend tests exercise temporary stores, including concurrency, moderation, duration/sequence validation, retention, ownership, privacy signals and cookie bootstrap. Browser checks cover review post/edit/report/remove/sort, UBC study dialogue, recording only after exploration, opt-out and deletion. A CWRU integration draft also inherited the preference correctly; that draft was subsequently handed to its campus thread and removed from this release. No claim is made of 60 FPS or physical-device audio/performance testing.

## Production browser verification

These unretouched captures were made on `https://asymmetri.co/labs/ubc` and its linked privacy page on October 31, 2026, after activation of source `704a9b3bfc2a3eafcac0360f490af01aafbf56ff`, BUILD_ID `sEPpfQJeW_TCHMYdvJXV0`.

- [Live desktop review form](live-reviews-desktop.jpg): 1280×720; empty public review form above the footer. No production test review was posted.
- [Live phone review form](live-reviews-mobile.jpg): 390×844; rating stars, name and optional comment fields fit without horizontal overflow.
- [Live walking after directory close](live-walking.jpg): 1280×720; the canvas receives focus immediately and holding W moves toward the gateway without another scene click.
- [Live privacy details](live-privacy.jpg): 413×598; disclosure and controls reached in a separate tab, leaving the campus page open.

The live 3D scene loaded at the entrance letters. The directory showed one Crescent West entry describing seven building footprints and no student-name directory. Console inspection returned no warning/error entries. Privacy recording was switched off before this test play and the original preference restored afterward; no history was deleted. The Halloween preference and temporary viewport override were restored. Public review submission/edit/report/removal and analytics persistence were tested in isolated stores, not with synthetic production records. These are browser viewport checks, not physical-device or measured-FPS claims.
