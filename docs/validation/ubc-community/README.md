# Campus community local validation

These are real browser captures of the isolated local application on October 31, 2026. They are not production deployment evidence. The review cards contain explicitly labeled synthetic local fixtures; no test review was published to the live website. Desktop and mobile here describe viewport emulation, not physical-device tests.

- [Student encounter](student-conversation.jpg): 1280×720; an unlabeled encounter introduces Anton Afanassiev naturally and offers study/source follow-ups. The scene and cosmetic character are original procedural geometry, not a likeness.
- [Review cards](reviews-desktop.jpg): 1280×720; synthetic test ratings, distribution and cards. Development chrome may appear.
- [Phone review form](reviews-mobile-form.jpg): 390×844; chosen public name, 1–5 stars and optional comments.
- [Phone privacy controls](privacy-mobile.jpg): 390×844; production-build rendering of the notice, opt-out and history-removal controls. The page explains the private records and their limits.

Final TypeScript/ESLint checks, 592 automated tests and the production dependency audit passed. The Next prebuild covered seven suites totaling 511 tests; Vancouver and investment regression suites added 81. Next and Vinext builds passed. Backend tests exercise temporary stores, including concurrency, moderation, duration/sequence validation, retention, ownership, privacy signals and cookie bootstrap. Browser checks cover review post/edit/report/remove/sort, UBC study dialogue, recording only after exploration, opt-out and deletion. A CWRU integration draft also inherited the preference correctly; that draft was subsequently handed to its campus thread and removed from this release. No claim is made of 60 FPS or physical-device audio/performance testing.
