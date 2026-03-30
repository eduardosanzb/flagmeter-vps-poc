# Implementation Plan: PocketBase Migration — Add language and referrer fields

**Date**: 2026-03-30
**Status**: COMPLETED

## Overview

Add a PocketBase migration to extend the `assessments` collection with `language` and `referrer` fields. These fields capture the user's locale and the referring page when submitting the assessment wizard. The migration must run automatically on container start (via the existing `migrate up` command in compose.dev.yml). Verified by building and starting the PocketBase container locally and confirming the schema update via the health/API endpoint.

## Scope

- Work units: 1
- Execution phases: 1
- Files affected:
  - `infra/pocketbase/pb_migrations/2_add_language_referrer.js` (create)

## Work Units

### WU-1: Create PocketBase migration to add language and referrer fields

**Dependencies**: none

**Context**: The assessment wizard (SITE-1 implementation, completed in commits 8739c35..e8537be) now sends `language` and `referrer` in the submission payload to PocketBase. However, PocketBase rejects unknown fields — the `assessments` collection schema must be updated to accept them. PocketBase uses JavaScript migrations located in `infra/pocketbase/pb_migrations/`. The existing migration `1_create_assessments.js` creates the collection with all question fields. A new migration `2_add_language_referrer.js` needs to add two text fields to the existing collection. The migration runs automatically via the container startup command: `./pocketbase migrate up --dir=/pb/pb_data --migrationsDir=/pb/pb_migrations`.

The existing migration (`1_create_assessments.js`) uses this pattern:
- `migrate(upFn, downFn)` as the top-level call
- `new Collection({...})` for creation with `fields` as an array of plain objects like `{ name: "source", type: "text", required: false, max: 50 }`
- `app.save(collection)` to persist
- `app.findCollectionByNameOrId("assessments")` to look up existing collections
- Type reference: `/// <reference path="../pb_data/types.d.ts" />`
- PocketBase version: 0.36.7

For modifying an existing collection in PocketBase 0.36.x, the pattern is:
1. Find the collection with `app.findCollectionByNameOrId()`
2. Add fields with `collection.fields.add(new Field({...}))`
3. Save with `app.save(collection)`
4. To remove fields (DOWN): `collection.fields.removeByName("fieldName")`

**Files**:
- `infra/pocketbase/pb_migrations/2_add_language_referrer.js` — create

**Steps**:

1. Create the file `infra/pocketbase/pb_migrations/2_add_language_referrer.js` with the following content:

```javascript
/// <reference path="../pb_data/types.d.ts" />
migrate(
  // UP — add language and referrer tracking fields to assessments
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");

    // Language code the user completed the assessment in ("en", "de", "es")
    collection.fields.add(new Field({
      name: "language",
      type: "text",
      required: false,
      max: 10,
    }));

    // HTTP Referer — the page the user navigated from (document.referrer)
    collection.fields.add(new Field({
      name: "referrer",
      type: "text",
      required: false,
      max: 2048,
    }));

    return app.save(collection);
  },

  // DOWN — remove the added fields
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");
    collection.fields.removeByName("language");
    collection.fields.removeByName("referrer");
    return app.save(collection);
  }
);
```

Key design decisions:
- Both fields are `required: false` so existing records and submissions without these fields still work.
- `language` has `max: 10` — language codes are 2-5 chars (e.g., "en", "de", "es").
- `referrer` has `max: 2048` — standard URL length limit. Using `type: "text"` instead of `type: "url"` because `document.referrer` can be an empty string (which would fail URL validation).
- Both fields use `type: "text"` for maximum compatibility.

**Verification**: `docker compose -f compose.dev.yml up --build -d pocketbase && sleep 10 && curl -sf http://localhost:8090/api/health && curl -sf http://localhost:8090/api/collections/assessments | grep -q '"language"' && curl -sf http://localhost:8090/api/collections/assessments | grep -q '"referrer"' && echo "PASS" || echo "FAIL"`

**Rollback**:
- Created files: `rm -f infra/pocketbase/pb_migrations/2_add_language_referrer.js`

## Execution Plan

### Phase 1 — Single unit
- WU-1: Create PocketBase migration file

## Recovery Strategy

- **Automatic**: If the migration file has a syntax error, PocketBase logs the error on startup but continues running with the old schema. The migration can be fixed and the container rebuilt.
- **Global rollback**: `rm -f infra/pocketbase/pb_migrations/2_add_language_referrer.js`
- **Data safety**: The migration only adds optional fields — no existing data is modified or deleted. The DOWN migration removes only the new fields.
