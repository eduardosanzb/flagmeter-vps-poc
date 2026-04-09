# Implementation Plan: LinkedIn PDF Padding Fix

**Date**: 2026-04-07 **Status**: COMPLETED

## Overview

Fix the "header" issue in LinkedIn pitch deck slides by adjusting padding to reduce empty space at the top. The slides currently have equal padding on all sides, which creates excessive whitespace at the top when content is vertically centered in LinkedIn's PDF viewer.

## Scope

- Work units: 1
- Execution phases: 1
- Files affected:
  - `apps/landing/layouts/slides/single.html`

## Work Units

### WU-1: Adjust Slide Padding for LinkedIn PDF Export

**Dependencies**: none

**Context**: The pitch deck slides have equal padding on all sides (3rem = 48px), which creates excessive empty space at the top when content is vertically centered. This makes the slides look unbalanced in LinkedIn's PDF viewer. Reducing the top padding while maintaining comfortable side and bottom padding will improve the visual balance.

**Files**:
- `apps/landing/layouts/slides/single.html` — modify

**Steps**:
1. Locate line 48 in `apps/landing/layouts/slides/single.html`
2. Change `padding: 3rem !important;` to `padding: 1.5rem 3rem 3rem 3rem !important;`
3. This reduces top padding from 48px to 24px while keeping sides and bottom at 48px

**Verification**: 
```bash
grep -n "padding:" apps/landing/layouts/slides/single.html | grep "1.5rem 3rem 3rem 3rem"
```

**Rollback**:
```bash
git checkout -- apps/landing/layouts/slides/single.html
```

## Execution Plan

### Phase 1 — Single Work Unit

- WU-1: Adjust Slide Padding for LinkedIn PDF Export

## Recovery Strategy

- **Automatic**: Each implementor rolls back and retries once on failure.
- **Dependency failure**: N/A (single work unit with no dependencies)
- **Global rollback**: `git checkout -- apps/landing/layouts/slides/single.html`
- **Independent failures**: N/A (single work unit)
