# Implementation Plan: AI Strategy Prompt Fixes

**Date**: 2026-04-17  **Status**: COMPLETED

## Overview

Nine targeted fixes to the three AI Strategy Assessment prompt files (`claude`, `coding-agent`, `notion`) to address real friction points surfaced from an end-to-end run. No new features — only patching edge cases: memory/context handling, solo operator framing, pacing, transition friction, dialectical pair language, and date UX.

## Scope

- Work units: 3
- Execution phases: 1 (all parallel — no file overlaps)
- Files affected:
  - `apps/landing/content/ai-strategy-prompt-claude.en.md`
  - `apps/landing/content/ai-strategy-prompt-coding-agent.en.md`
  - `apps/landing/content/ai-strategy-prompt-notion.en.md`

---

## Work Units

### WU-1: Fix ai-strategy-prompt-claude.en.md (9 fixes)

**Dependencies**: none

**Context**: This is one of three platform-specific prompt files for an AI Strategy Assessment tool. Each file is a long system prompt (~275 lines) stored as Hugo markdown content with `_build: render: never` (meaning Hugo never renders it to a page — it's just served as raw content). The file lives at `apps/landing/content/ai-strategy-prompt-claude.en.md`. The assessment walks users through 5 dimensions of AI maturity with scoring and synthesis. Nine fixes are needed based on a live run debrief. Apply each fix exactly as described — do not change any other content.

**Files**:
- `apps/landing/content/ai-strategy-prompt-claude.en.md` — modify

**Steps**:

1. **Fix 1 — Memory/context unification (Phase 0)**

   Find this exact text (line ~14):
   ```
   **If you have Project Knowledge attached:**
   1. Read through the Project Knowledge now
   2. Look for: tech stack, company description, team size, existing AI tool usage, any AI policies or guidelines
   3. Present your findings: "Based on your Project Knowledge, I can see you're building [X] with [Y] tech stack. I see references to [Z AI tools]. Team appears to be around [N] people. Does this match your current situation? Anything changed recently?"
   4. Wait for confirmation before proceeding
   ```

   Replace with:
   ```
   **If you have Project Knowledge attached, or persistent memory of this user from past conversations:**
   1. Read through the Project Knowledge / memory now — treat both as equivalent context sources
   2. Look for: tech stack, company description, team size, existing AI tool usage, any AI policies or guidelines
   3. Present your findings: "Based on what I know about you, I can see you're building [X] with [Y] tech stack. I see references to [Z AI tools]. Team appears to be around [N] people. Does this match your current situation? Anything changed recently?"
   4. Wait for confirmation before proceeding
   ```

2. **Fix 2 — Context confirmation → deeper questions (Step 2 of "How to Conduct")**

   Find this exact text (line ~131):
   ```
   2. Before starting Dimension 1, ask three brief context questions to understand who you're talking to: roughly how many people are in the company, what the product does in one sentence, and how the team is currently using AI today. Use these answers throughout — they make scoring more accurate and peer comparisons more specific.
   ```

   Replace with:
   ```
   2. Before starting Dimension 1, check whether Phase 0 already surfaced answers about team size, what the product does, and how they use AI today. If those answers are already known, skip these questions and instead ask one deeper follow-up — for example: if you know they use Claude heavily, ask what they deliberately *don't* use it for, or what data they'd never send to an AI provider. If context is not yet known, ask the three questions: roughly how many people are in the company, what the product does in one sentence, and how the team is currently using AI today. Use these answers throughout — they make scoring more accurate and peer comparisons more specific.
   ```

3. **Fix 3 — Adaptive pacing (Step 3a)**

   Find this exact text (line ~140):
   ```
      a. Ask 2-3 questions about the user's current situation in that dimension. Wait for their answers. If something is unclear, follow up before asking the next question. Don't dump all questions in one message.
   ```

   Replace with:
   ```
      a. Ask 2-3 questions about the user's current situation in that dimension. If their first answer is unambiguous, score immediately and move on — don't ask unnecessary follow-ups. Only dig deeper when the level is genuinely unclear. Wait for answers before following up. Don't dump all questions in one message.
   ```

4. **Fix 4 — Progress tracker timing (Step 3f)**

   Find this exact text (line ~140-141):
   ```
      f. Show a compact progress snapshot before moving to the next dimension. Use filled blocks (█) for scored dimensions and dashes for unscored:
   ```

   Replace with:
   ```
      f. Show a compact progress snapshot after scoring and stating next steps, and before introducing the next dimension. Use filled blocks (█) for scored dimensions and dashes for unscored:
   ```

5. **Fix 5 — Date handling (Step 1)**

   Find this exact text (line ~129):
   ```
   Then ask for the user's name (or company name) and confirm today's date. Use these throughout the outputs. Do not skip this step.
   ```

   Replace with:
   ```
   Then ask for the user's name (or company name). Use today's date automatically — do not ask the user for it. Use name and date throughout the outputs. Do not skip this step.
   ```

6. **Fix 6 — Dialectical pairs heading**

   Find this exact text (line ~103):
   ```
   **Dialectical pairs with trigger phrases:**
   ```

   Replace with:
   ```
   **Dialectical pairs — patterns to watch for:**
   ```

   Then find this exact text (line ~125):
   ```
   These are reference patterns — use them to recognize where the user is coming from and guide toward the practical position. Don't force a dialectical exchange if the user is already balanced.
   ```

   Replace with:
   ```
   Use these to recognize where the user is coming from and guide toward the practical position. Treat them as pattern recognition cues, not if/then rules — don't force a dialectical exchange if the user is already balanced.
   ```

7. **Fix 7 — No "are you ready to move on?" transitions**

   Find this exact text (last bullet in Important Guidelines, line ~273):
   ```
   * Aim for 15-20 total messages before synthesis. If you're past that, you're overasking — wrap up the current dimension and move on.
   ```

   Replace with:
   ```
   * Aim for 15-20 total messages before synthesis. If you're past that, you're overasking — wrap up the current dimension and move on.
   * Do not ask the user if they are ready to move to the next dimension — just move. Keep momentum.
   ```

8. **Fix 8 — Self-research disclaimer (Step 9)**

   Find this exact text (line ~168-169):
   ```
   9. Then add a brief, honest disclaimer: "One thing worth noting: this was a self-reported snapshot, not an audit. Your actual levels might differ if I talked to your full team. The value isn't the score — it's the questions it forced you to think about. That's exactly what the 15 minutes is for."
   ```

   Replace with:
   ```
   9. Then add a brief, honest disclaimer: "One thing worth noting: this is entirely self-reported — no external research was performed. Your actual levels might differ if I talked to your full team. The value isn't the score — it's the questions it forced you to think about. That's exactly what the 15 minutes is for."
   ```

9. **Fix 9 — Solo operator note (Important Guidelines)**

   Find this exact text (line ~272):
   ```
   * Write in a direct, engineer-to-engineer tone. No corporate jargon.
   ```

   Replace with:
   ```
   * Write in a direct, engineer-to-engineer tone. No corporate jargon.
   * For solo operators or very small teams (under 3 people), adapt: reframe Governance as "how deliberately do you choose your AI tools" and Team Health as "your personal relationship with AI — sustainability, dependency, skill growth vs. atrophy."
   ```

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && pnpm build 2>&1 | tail -5 && echo "BUILD_OK"`

**Rollback**:
- Modified files: `git checkout -- apps/landing/content/ai-strategy-prompt-claude.en.md`

---

### WU-2: Fix ai-strategy-prompt-coding-agent.en.md (9 fixes)

**Dependencies**: none

**Context**: This is the coding agent variant of the AI Strategy Assessment prompt, stored at `apps/landing/content/ai-strategy-prompt-coding-agent.en.md`. Unlike the Claude variant, Phase 0 here performs an active codebase scan (reads package.json, .env.example, searches for abstraction layers, SDK calls, data routing, and governance files like CLAUDE.md). The core assessment body (Dimensions, Dialectical Strategy, How to Conduct, Output Format, Important Guidelines) is nearly identical to the Claude variant. Nine fixes must be applied — most are identical to WU-1 but Fix 1 and Fix 8 have platform-specific wording. Do not change any other content.

**Files**:
- `apps/landing/content/ai-strategy-prompt-coding-agent.en.md` — modify

**Steps**:

1. **Fix 1 — Memory/context unification (Phase 0 intro paragraph)**

   Find this exact text (line ~10-12):
   ```
   ## Phase 0: Context Sync (Do this BEFORE anything else)

   Before introducing the assessment or asking any questions, scan the codebase to auto-discover the company's current AI posture:
   ```

   Replace with:
   ```
   ## Phase 0: Context Sync (Do this BEFORE anything else)

   Before introducing the assessment or asking any questions, scan the codebase to auto-discover the company's current AI posture. If you also have persistent memory of this user from past conversations, use it as additional context alongside the codebase scan.
   ```

2. **Fix 2 — Context confirmation → deeper questions (Step 2 of "How to Conduct")**

   Find this exact text (line ~136):
   ```
   2. Before starting Dimension 1, ask three brief context questions to understand who you're talking to: roughly how many people are in the company, what the product does in one sentence, and how the team is currently using AI today. Use these answers throughout — they make scoring more accurate and peer comparisons more specific.
   ```

   Replace with:
   ```
   2. Before starting Dimension 1, check whether Phase 0 already surfaced answers about team size, what the product does, and how they use AI today — the codebase scan likely answered these. If so, skip these questions and instead ask one deeper follow-up — for example: if you found direct OpenAI SDK calls, ask whether that was a deliberate choice or the path of least resistance. If context is not yet known, ask the three questions: roughly how many people are in the company, what the product does in one sentence, and how the team is currently using AI today. Use these answers throughout — they make scoring more accurate and peer comparisons more specific.
   ```

3. **Fix 3 — Adaptive pacing (Step 3a)**

   Find this exact text (line ~140):
   ```
      a. Ask 2-3 questions about the user's current situation in that dimension. Wait for their answers. If something is unclear, follow up before asking the next question. Don't dump all questions in one message.
   ```

   Replace with:
   ```
      a. Ask 2-3 questions about the user's current situation in that dimension. If their first answer is unambiguous, score immediately and move on — don't ask unnecessary follow-ups. Only dig deeper when the level is genuinely unclear. Wait for answers before following up. Don't dump all questions in one message.
   ```

4. **Fix 4 — Progress tracker timing (Step 3f)**

   Find this exact text (line ~145-146):
   ```
      f. Show a compact progress snapshot before moving to the next dimension. Use filled blocks (█) for scored dimensions and dashes for unscored:
   ```

   Replace with:
   ```
      f. Show a compact progress snapshot after scoring and stating next steps, and before introducing the next dimension. Use filled blocks (█) for scored dimensions and dashes for unscored:
   ```

5. **Fix 5 — Date handling (Step 1)**

   Find this exact text (line ~134):
   ```
   Then ask for the user's name (or company name) and confirm today's date. Use these throughout the outputs. Do not skip this step.
   ```

   Replace with:
   ```
   Then ask for the user's name (or company name). Use today's date automatically — do not ask the user for it. Use name and date throughout the outputs. Do not skip this step.
   ```

6. **Fix 6 — Dialectical pairs heading**

   Find this exact text (line ~108):
   ```
   **Dialectical pairs with trigger phrases:**
   ```

   Replace with:
   ```
   **Dialectical pairs — patterns to watch for:**
   ```

   Then find this exact text (line ~130):
   ```
   These are reference patterns — use them to recognize where the user is coming from and guide toward the practical position. Don't force a dialectical exchange if the user is already balanced.
   ```

   Replace with:
   ```
   Use these to recognize where the user is coming from and guide toward the practical position. Treat them as pattern recognition cues, not if/then rules — don't force a dialectical exchange if the user is already balanced.
   ```

7. **Fix 7 — No "are you ready to move on?" transitions**

   Find this exact text (last bullet in Important Guidelines, line ~278):
   ```
   * Aim for 15-20 total messages before synthesis. If you're past that, you're overasking — wrap up the current dimension and move on.
   ```

   Replace with:
   ```
   * Aim for 15-20 total messages before synthesis. If you're past that, you're overasking — wrap up the current dimension and move on.
   * Do not ask the user if they are ready to move to the next dimension — just move. Keep momentum.
   ```

8. **Fix 8 — Self-research disclaimer (Step 9)** *(coding-agent specific wording)*

   Find this exact text (line ~173-174):
   ```
   9. Then add a brief, honest disclaimer: "One thing worth noting: this was a self-reported snapshot, not an audit. Your actual levels might differ if I talked to your full team. The value isn't the score — it's the questions it forced you to think about. That's exactly what the 15 minutes is for."
   ```

   Replace with:
   ```
   9. Then add a brief, honest disclaimer: "One thing worth noting: this is based on your codebase scan and self-reported answers — not an independent audit. Your actual levels might differ if I talked to your full team. The value isn't the score — it's the questions it forced you to think about. That's exactly what the 15 minutes is for."
   ```

9. **Fix 9 — Solo operator note (Important Guidelines)**

   Find this exact text (line ~277):
   ```
   * Write in a direct, engineer-to-engineer tone. No corporate jargon.
   ```

   Replace with:
   ```
   * Write in a direct, engineer-to-engineer tone. No corporate jargon.
   * For solo operators or very small teams (under 3 people), adapt: reframe Governance as "how deliberately do you choose your AI tools" and Team Health as "your personal relationship with AI — sustainability, dependency, skill growth vs. atrophy."
   ```

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && pnpm build 2>&1 | tail -5 && echo "BUILD_OK"`

**Rollback**:
- Modified files: `git checkout -- apps/landing/content/ai-strategy-prompt-coding-agent.en.md`

---

### WU-3: Fix ai-strategy-prompt-notion.en.md (9 fixes)

**Dependencies**: none

**Context**: This is the Notion AI variant of the AI Strategy Assessment prompt, stored at `apps/landing/content/ai-strategy-prompt-notion.en.md`. Unlike the Claude variant, Phase 0 here performs an active Notion workspace search (looks for AI policy docs, company overview, team directory, vendor agreements, AI spend data). The core assessment body is nearly identical to the Claude variant. Nine fixes must be applied — most identical to WU-1 but Fix 1 and Fix 8 have platform-specific wording. Do not change any other content.

**Files**:
- `apps/landing/content/ai-strategy-prompt-notion.en.md` — modify

**Steps**:

1. **Fix 1 — Memory/context unification (Phase 0 intro paragraph)**

   Find this exact text (line ~10-12):
   ```
   ## Phase 0: Context Sync (Do this BEFORE anything else)

   Before introducing the assessment or asking any questions, search the Notion workspace to auto-discover company context:
   ```

   Replace with:
   ```
   ## Phase 0: Context Sync (Do this BEFORE anything else)

   Before introducing the assessment or asking any questions, search the Notion workspace to auto-discover company context. If you also have persistent memory of this user from past conversations, use it as additional context alongside the workspace search.
   ```

2. **Fix 2 — Context confirmation → deeper questions (Step 2 of "How to Conduct")**

   Find this exact text (line ~134):
   ```
   2. Before starting Dimension 1, ask three brief context questions to understand who you're talking to: roughly how many people are in the company, what the product does in one sentence, and how the team is currently using AI today. Use these answers throughout — they make scoring more accurate and peer comparisons more specific.
   ```

   Replace with:
   ```
   2. Before starting Dimension 1, check whether Phase 0 already surfaced answers about team size, what the product does, and how they use AI today — the workspace search likely answered these. If so, skip these questions and instead ask one deeper follow-up — for example: if you found an AI policy doc, ask whether engineers actually follow it or whether it's aspirational. If context is not yet known, ask the three questions: roughly how many people are in the company, what the product does in one sentence, and how the team is currently using AI today. Use these answers throughout — they make scoring more accurate and peer comparisons more specific.
   ```

3. **Fix 3 — Adaptive pacing (Step 3a)**

   Find this exact text (line ~138):
   ```
      a. Ask 2-3 questions about the user's current situation in that dimension. Wait for their answers. If something is unclear, follow up before asking the next question. Don't dump all questions in one message.
   ```

   Replace with:
   ```
      a. Ask 2-3 questions about the user's current situation in that dimension. If their first answer is unambiguous, score immediately and move on — don't ask unnecessary follow-ups. Only dig deeper when the level is genuinely unclear. Wait for answers before following up. Don't dump all questions in one message.
   ```

4. **Fix 4 — Progress tracker timing (Step 3f)**

   Find this exact text (line ~143-144):
   ```
      f. Show a compact progress snapshot before moving to the next dimension. Use filled blocks (█) for scored dimensions and dashes for unscored:
   ```

   Replace with:
   ```
      f. Show a compact progress snapshot after scoring and stating next steps, and before introducing the next dimension. Use filled blocks (█) for scored dimensions and dashes for unscored:
   ```

5. **Fix 5 — Date handling (Step 1)**

   Find this exact text (line ~132):
   ```
   Then ask for the user's name (or company name) and confirm today's date. Use these throughout the outputs. Do not skip this step.
   ```

   Replace with:
   ```
   Then ask for the user's name (or company name). Use today's date automatically — do not ask the user for it. Use name and date throughout the outputs. Do not skip this step.
   ```

6. **Fix 6 — Dialectical pairs heading**

   Find this exact text (line ~106):
   ```
   **Dialectical pairs with trigger phrases:**
   ```

   Replace with:
   ```
   **Dialectical pairs — patterns to watch for:**
   ```

   Then find this exact text (line ~128):
   ```
   These are reference patterns — use them to recognize where the user is coming from and guide toward the practical position. Don't force a dialectical exchange if the user is already balanced.
   ```

   Replace with:
   ```
   Use these to recognize where the user is coming from and guide toward the practical position. Treat them as pattern recognition cues, not if/then rules — don't force a dialectical exchange if the user is already balanced.
   ```

7. **Fix 7 — No "are you ready to move on?" transitions**

   Find this exact text (last bullet in Important Guidelines, line ~276):
   ```
   * Aim for 15-20 total messages before synthesis. If you're past that, you're overasking — wrap up the current dimension and move on.
   ```

   Replace with:
   ```
   * Aim for 15-20 total messages before synthesis. If you're past that, you're overasking — wrap up the current dimension and move on.
   * Do not ask the user if they are ready to move to the next dimension — just move. Keep momentum.
   ```

8. **Fix 8 — Self-research disclaimer (Step 9)** *(notion specific wording)*

   Find this exact text (line ~171-172):
   ```
   9. Then add a brief, honest disclaimer: "One thing worth noting: this was a self-reported snapshot, not an audit. Your actual levels might differ if I talked to your full team. The value isn't the score — it's the questions it forced you to think about. That's exactly what the 15 minutes is for."
   ```

   Replace with:
   ```
   9. Then add a brief, honest disclaimer: "One thing worth noting: this is based on your workspace search and self-reported answers — not an independent audit. Your actual levels might differ if I talked to your full team. The value isn't the score — it's the questions it forced you to think about. That's exactly what the 15 minutes is for."
   ```

9. **Fix 9 — Solo operator note (Important Guidelines)**

   Find this exact text (line ~275):
   ```
   * Write in a direct, engineer-to-engineer tone. No corporate jargon.
   ```

   Replace with:
   ```
   * Write in a direct, engineer-to-engineer tone. No corporate jargon.
   * For solo operators or very small teams (under 3 people), adapt: reframe Governance as "how deliberately do you choose your AI tools" and Team Health as "your personal relationship with AI — sustainability, dependency, skill growth vs. atrophy."
   ```

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && pnpm build 2>&1 | tail -5 && echo "BUILD_OK"`

**Rollback**:
- Modified files: `git checkout -- apps/landing/content/ai-strategy-prompt-notion.en.md`

---

## Execution Plan

### Phase 1 — Parallel (no dependencies)

- WU-1: Fix `ai-strategy-prompt-claude.en.md` (9 fixes)
- WU-2: Fix `ai-strategy-prompt-coding-agent.en.md` (9 fixes)
- WU-3: Fix `ai-strategy-prompt-notion.en.md` (9 fixes)

---

## Recovery Strategy

- **Automatic**: Each implementor rolls back and retries once on failure.
- **Dependency failure**: N/A — all units are independent.
- **Global rollback**: `git checkout -- apps/landing/content/ai-strategy-prompt-claude.en.md apps/landing/content/ai-strategy-prompt-coding-agent.en.md apps/landing/content/ai-strategy-prompt-notion.en.md`
- **Independent failures**: Each file is isolated — a failure in WU-2 does not affect WU-1 or WU-3.
