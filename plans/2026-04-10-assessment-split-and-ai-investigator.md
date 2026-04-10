# Implementation Plan: Assessment Split & AI Investigator Flow

**Date**: 2026-04-10 **Status**: PENDING APPROVAL

## Overview

Separates the Infrastructure and AI assessments to eliminate user confusion. Removes AI scoring from the infrastructure wizard. Redesigns the AI Strategy page to feature an "Investigator" agent flow with platform-specific prompts (Cursor, Notion, Claude) and a trust-building "How it works" section.

## Scope

- Work units: 4
- Execution phases: 2
- Files affected:
  - `apps/landing/i18n/*.toml`
  - `apps/landing/content/assessments/infrastructure.*.md`
  - `apps/landing/layouts/assessment/single.html`
  - `apps/landing/layouts/_default/ai-strategy.html`
  - `apps/landing/content/ai-strategy-prompt-*.md` (new files, replacing old prompt)

## Work Units

### WU-1: Navigation and Infra Content Cleanup

**Dependencies**: none

**Context**: We need to clearly delineate the two assessments in the navigation and remove AI-specific questions from the infrastructure assessment so it purely focuses on Sovereignty and Cost.

**Files**:
- `apps/landing/i18n/en.toml` — modify
- `apps/landing/i18n/de.toml` — modify
- `apps/landing/i18n/es.toml` — modify
- `apps/landing/content/assessments/infrastructure.en.md` — modify
- `apps/landing/content/assessments/infrastructure.de.md` — modify
- `apps/landing/content/assessments/infrastructure.es.md` — modify

**Steps**:
1. Update i18n files: Change `navigation.assessment` to "Infra Assessment" (EN), "Infra-Assessment" (DE), "Assessment de Infraestructura" (ES). Change `navigation.aiStrategy` to "AI Assessment" (EN), "KI-Assessment" (DE), "Assessment de IA" (ES).
2. Open the three `infrastructure.*.md` files and remove the array items for `q_ai_adoption` and `q_ai_coupling`. Ensure valid YAML.

**Verification**: `grep -q "Infra Assessment" apps/landing/i18n/en.toml && ! grep -q "q_ai_adoption" apps/landing/content/assessments/infrastructure.en.md || exit 1`

**Rollback**:
- `git checkout -- apps/landing/i18n/ apps/landing/content/assessments/`

### WU-2: Create Investigator Prompts

**Dependencies**: none

**Context**: Replace the single generic AI strategy prompt with three platform-specific prompts (Cursor, Notion, Claude) that use an "Investigator" flow (Phase 0 context fetch, auto-discovery, dialectical review, snapshot).

**Files**:
- `apps/landing/content/ai-strategy-prompt-cursor.*.md` — create
- `apps/landing/content/ai-strategy-prompt-notion.*.md` — create
- `apps/landing/content/ai-strategy-prompt-claude.*.md` — create
- `apps/landing/content/ai-strategy-prompt.*.md` — delete

**Steps**:
1. Delete the existing `ai-strategy-prompt.*.md` files (EN, DE, ES).
2. Create the Cursor prompt file for EN, DE, ES instructing the agent to scan `package.json`, `.env`, and repo files for AI SDKs/keys to infer vendor lock-in and governance, before asking clarifying questions.
3. Create the Notion prompt instructing the agent to search the workspace for AI policies, data routing rules, and company directory.
4. Create the Claude prompt instructing the agent to rely on Project Knowledge or ask for a brief context dump before proceeding.
5. Ensure all prompt files have `_build: { render: never, list: never }` in their frontmatter.

**Verification**: `ls apps/landing/content/ai-strategy-prompt-cursor.en.md`

**Rollback**:
- `git checkout -- apps/landing/content/ai-strategy-prompt*`

### WU-3: Strip AI Readiness from Infra Layout

**Dependencies**: WU-1

**Context**: The infra assessment layout calculates and displays three scores. We need to remove the "AI-Readiness" score so it only shows "Sovereignty" and "Cost Resilience".

**Files**:
- `apps/landing/layouts/assessment/single.html` — modify

**Steps**:
1. Remove JavaScript scoring logic related to `aiScore`, `q_ai_adoption`, and `q_ai_coupling`.
2. Remove the AI-Readiness UI progress bar and score card from the results section.
3. Update the tier calculation to only depend on infra and cost scores.

**Verification**: `grep -q "AI-Readiness" apps/landing/layouts/assessment/single.html && exit 1 || exit 0`

**Rollback**:
- `git checkout -- apps/landing/layouts/assessment/single.html`

### WU-4: Redesign AI Strategy Layout

**Dependencies**: WU-2

**Context**: The AI Strategy page needs a tabbed UI to select between the Cursor, Notion, and Claude prompts, and a "How it works" visual section to build trust before the slides.

**Files**:
- `apps/landing/layouts/_default/ai-strategy.html` — modify

**Steps**:
1. Add a 4-step "How it works" section below the hero: 1. Context Sync, 2. Auto-Discovery, 3. Dialectical Review, 4. Actionable Snapshot.
2. Modify the prompt card in the hero to include 3 tabs (Cursor, Notion, Claude).
3. Load the raw content of the 3 new hidden prompt pages and use JavaScript to swap the copied text based on the active tab.

**Verification**: `grep -q "Context Sync" apps/landing/layouts/_default/ai-strategy.html`

**Rollback**:
- `git checkout -- apps/landing/layouts/_default/ai-strategy.html`

## Execution Plan

### Phase 1 — Parallel (no dependencies)
- WU-1: Navigation and Infra Content Cleanup
- WU-2: Create Investigator Prompts

### Phase 2 — Parallel (requires Phase 1)
- WU-3: Strip AI Readiness from Infra Layout
- WU-4: Redesign AI Strategy Layout

## Recovery Strategy
- **Automatic**: Each implementor rolls back and retries once on failure.
- **Dependency failure**: If WU-1 fails, WU-3 will not run. If WU-2 fails, WU-4 will not run.
- **Global rollback**: `git reset HEAD~N --hard`
