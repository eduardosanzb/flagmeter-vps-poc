# Implementation Plan: Backlog Updates (Analytics, Infra, Sales Pipeline)

**Date**: 2026-04-02
**Status**: COMPLETED

## Overview
Update the `BACKLOG.md` to reflect the latest status of various tasks: marking analytics checks as completed (since Umami is verified in production), advancing Article 5 to in-progress, deferring infrastructure migration tasks as non-MVP, scheduling manual distribution tasks for next week, and linking the new sales pipeline tracking document.

## Scope
- Work units: 1
- Execution phases: 1
- Files affected:
  - `BACKLOG.md`

## Work Units

### WU-1: Update BACKLOG.md Task Statuses

**Dependencies**: none

**Context**: The project backlog needs updating to reflect recent progress and priority shifts. Analytics have been verified working in production, Article 5 is actively being worked on, certain infrastructure decoupling tasks are deferred as they are not needed for the MVP, manual distribution tasks are pushed to next week, and the sales pipeline tracking document has been created on Outline.

**Files**:
- `BACKLOG.md` — modify

**Steps**:
1. At the top of the file, update **Last updated:** to `2026-04-02`.
2. Under `### What's Broken`, remove the bullet point `- **Analytics unverified**: Umami may not be firing in production...`.
3. Under `### Phase 1 Progress`, update the table counts:
   - For `Site Conversion`: Change `Remaining` from `SITE-5` to `None`. Update `Done` from `4` to `5`.
   - For `Infrastructure`: Move `#85` to `Done`. Note `#53` and `#64` as `Deferred`.
   - For `Distribution`: Add `Scheduled` note to `DIST-1` through `DIST-5`.
4. Update `#### SITE-5: Verify Analytics in Production` and `#### INFRA-4: Fix Analytics` to `**Status:** ✅ Complete (Verified Umami running in production)`.
5. Update `#### CONTENT-1: Publish Article 5` to `**Status:** 🔄 In Progress`.
6. Update `#### INFRA-1: Migrate to ARM Hetzner Instance` and `#### INFRA-2: Decouple Database to Coolify DB` to `**Status:** ⏸️ Deferred (Not MVP)`.
7. Update `#### DIST-4`, `#### DIST-5`, and any other manual P0 tasks to `**Status:** Scheduled for next week`.
8. Update `#### SALES-4: Pipeline Tracking` to include `**Status:** ✅ Complete` and add the link: `https://notes.eduardosanzb.dev/doc/cold-outreach-engineering-leaders-FAgI6ppQQT`.

**Verification**: `grep -q "冷 Complete (Verified Umami running in production)" BACKLOG.md`

**Rollback**:
- Modified files: `git checkout -- BACKLOG.md`

## Execution Plan

### Phase 1 — Parallel (no dependencies)
- WU-1: Update BACKLOG.md Task Statuses

## Recovery Strategy
- **Automatic**: Each implementor rolls back and retries once on failure.
- **Global rollback**: `git checkout -- BACKLOG.md` or `git reset HEAD~1 --hard`.
