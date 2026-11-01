# UBC privacy-card removal — browser evidence

Real, unretouched local production-preview screenshots on October 31, 2026 (Vancouver). These document the owner-requested removal; they are not production deployment evidence.

- [Desktop welcome](welcome-desktop.jpg), 1280×720: title flows directly into the Halloween welcome with no Play privacy card.
- [Phone welcome](welcome-mobile.jpg), 390×844: no privacy panel or recording checkbox; normal seasonal controls remain.
- [Phone Project information](about-mobile.jpg), 390×844: project information has no privacy card. Its close control restores canvas focus.
- [Plain privacy article](plain-privacy-mobile.jpg), 413×598: factual article with no card, recording checkbox or deletion button.

The welcome and information view had no horizontal overflow; the article opened in a separate tab and also had no overflow. DOM checks confirmed the removed panel/checkbox are absent. The game loaded and returned focus to its canvas when the information panel closed. Console inspection returned no errors. No public review was posted. Temporary viewports were reset and local preview tabs/server closed. This is browser viewport testing, not physical-device certification.

Strict check and all 511 automatic prebuild tests passed. The initial Next compilation hit local ENOSPC; only obsolete owner-created generated outputs were cleared. Next compilation then passed without repeating successful tests, and Vinext also passed. No dependency, backend tracking, collection preference or production-store change was made. The snapshot used base `d93828d` plus the three UBC/shared TSX changes; exact-source Linux CI and live acceptance are separate.
