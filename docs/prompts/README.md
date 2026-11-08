# Engineering journal

Every file-changing user request receives one record in this directory. Records
preserve intent, decisions, verification, and repository state without copying
terminal transcripts, generated output, secrets, or raw diffs.

## Naming

Use the next unused zero-padded integer and one scope suffix:

```text
001-design.md
002-platform.md
003-content.md
004-deployment.md
```

Scope suffixes:

- `platform`: repository-wide tooling, architecture, or setup;
- `content`: copy, metadata, links, or product information;
- `design`: identity, assets, layout, styles, or components;
- `deployment`: hosting, access, automation, or release work.

## Required format

```markdown
# Prompt NNN: Short title

- Date: YYYY-MM-DD
- Scope: platform | content | design | deployment
- Goal: One-sentence outcome

## Original user request

> Verbatim user-visible message

For very large attachments, add a complete decision-oriented summary after the
verbatim user-visible message instead of copying thousands of lines.

## Scope

What was and was not included.

## Decisions

Important product, design, content, architecture, privacy, or deployment
choices and their rationale.

## Implementation

Concise description of the delivered result.

## Engineering impact

Behavioral, architectural, dependency, accessibility, privacy, and operational
impact.

## Files changed

Human-readable file groups. Do not paste a raw file listing.

## Documentation updated

Documents changed and why, or why no documentation change was required.

## Git diff summary

The implementation commit's `git diff --stat` totals plus a concise prose
summary. Do not paste a unified diff.

## Verification

Checks run and their outcomes.

## Repository state after implementation commit

Branch, implementation commit, worktree state, and relationship to the remote.

## Implementation commits

Every implementation commit created before this record.

## Archive commit

The intended archive commit message only. The SHA does not exist until after
this file is committed and is reported in the final response.

## Lessons learned

What future work should preserve or improve.

## Follow-up ideas

Optional, explicitly non-committed future work.
```

## Commit sequence

1. Commit implementation and affected documentation.
2. Create the prompt record from that committed state and commit the record
   separately.

The current record does not include its own diff or SHA. Historical records are
not rewritten just because later changes alter the repository.

## Codex prompt/response interaction log

In addition to the numbered Engineering Journal, **every direct user-to-Codex
prompt and its final user-visible Codex response** must be recorded in the
append-only monthly file `codex-interactions/YYYY-MM.md` (UTC month). This also
applies to questions, clarification turns, read-only tasks and blocked/failed
sessions. It excludes internal tool calls and subagent steps.

Use actual ISO 8601 UTC date/time values for **both** the prompt's receipt and
the response's preparation. One entry per turn, with this format:

```markdown
## Turn — YYYY-MM-DDTHH:MM:SSZ
- Prompt received (UTC): YYYY-MM-DDTHH:MM:SSZ
- Response prepared (UTC): YYYY-MM-DDTHH:MM:SSZ
- Context: Issue #N / skill / scope (if applicable)
- Outcome: completed | partial | blocked | failed

### User prompt
> User-visible prompt text, with explicit safety redactions if needed.

### Codex final response
> Final user-visible answer text, with explicit safety redactions if needed.
```

The repository is public: redact secrets, private personal information and
sensitive paths before committing, and identify redactions. Do not archive large
attachments, raw logs, hidden reasoning or generated artifacts; summarize
nontext attachments safely. Commit and push the entry even when the underlying
task was read-only. A **log-only update does not require its own numbered
Engineering Journal**; a substantive file-changing request still does.

