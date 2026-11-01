# UBC privacy interface follow-up

The owner asked to remove the Play privacy card and clarified that it should not
appear anywhere. This follow-up removes its rendering from the UBC landing page,
the explorer's help panel and the shared campus privacy article. It adds no
replacement banner, checkbox or deletion button.

UBC's notes retain a standard Privacy link that opens the plain article in a new
tab. The article still explains private IP/browser/play-duration measurement,
browser privacy signals, existing saved opt-outs, retention and contact details
for questions or removal requests. References to a nonexistent “control above”
have been removed.

The existing `PlaySession` mount, backend API, browser cookies, data stores,
request limits and retention are unchanged. Global Privacy Control and Do Not
Track continue to disable collection; previously saved opt-outs are honoured.
The browser-owned deletion API remains implemented even though these pages no
longer display its button.

`CampusPrivacyPreferences` remains exported for compatibility while CWRU and
Stanford owners remove their own imports. This workstream does not edit either
campus's source or claim their removals are complete. The shared article itself
contains no copy of the card.

Scoped ESLint and the integrated strict check passed on Node 24.10.0, along with
all 511 automatic prebuild tests. The initial Next compilation exhausted local
disk; only obsolete generated validation outputs were cleared. Next compilation
then passed without repeating successful tests, and Vinext passed.

[Local browser evidence](validation/ubc-privacy-ui/README.md) covers the 1280×720
desktop welcome, 390×844 phone welcome/information screen and 413×598 plain
privacy article. The removed panel and checkbox are absent, there is no
horizontal overflow, the link opens separately, and closing information restores
canvas focus. Console inspection returned no errors. Temporary preview tabs,
viewport and server were cleaned up. No physical-device claim is made.

Exact-source Linux CI and the coordinated production rollout remain separate
steps. CWRU and Stanford owners make their own equivalent changes; this
workstream does not stage their files. No markup-mirroring tests were added.
