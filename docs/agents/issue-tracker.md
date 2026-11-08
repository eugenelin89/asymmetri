# Website issue tracker

Track website tickets and specs in GitHub Issues for `eugenelin89/asymmetri`. Use `gh` from the website checkout. Verify the target with `gh repo view --json nameWithOwner` before publishing.

Read a ticket with `gh issue view NUMBER --comments`. Publish a prepared issue with `gh issue create --title TITLE --body-file FILE`. Use GitHub sub-issues for parent tickets and native issue dependencies for blockers. Apply labels from [the triage mapping](triage-labels.md).

PRs as a request surface: no.
