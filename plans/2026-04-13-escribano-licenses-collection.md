# Implementation Plan: Escribano Licenses PocketBase Collection

**Date**: 2026-04-13 **Status**: COMPLETED

## Overview

Create the `escribano_licenses` PocketBase collection via a migration file so the Escribano CLI can verify license keys. The CLI hits `GET /api/collections/escribano_licenses/records/{key}?fields=tier,revoked` and expects `{ tier: "beta"|"pro", revoked: bool }`. After the migration is created, push to main and deploy to the production server (hzowui).

## Scope

- Work units: 2
- Execution phases: 2
- Files affected:
  - `infra/pocketbase/pb_migrations/6_create_escribano_licenses.js` — create

## Work Units

### WU-1: Create escribano_licenses migration

**Dependencies**: none

**Context**: The Escribano CLI needs a PocketBase collection called `escribano_licenses` to verify license keys on activation. The collection was previously lost (likely due to a container/volume recreation) and needs to be recreated. This time it must be a version-controlled migration file so it's reproducible. The existing migrations in `infra/pocketbase/pb_migrations/` follow a numbered JS pattern (1 through 5 already exist). The PocketBase container runs `./pocketbase migrate up` on startup, so adding the file is sufficient — no manual intervention needed.

**Files**:
- `infra/pocketbase/pb_migrations/6_create_escribano_licenses.js` — create

**Steps**:

1. Create the file `infra/pocketbase/pb_migrations/6_create_escribano_licenses.js` with the following exact content:

```js
/// <reference path="../pb_data/types.d.ts" />
migrate(
  // UP — create the escribano_licenses collection
  (app) => {
    const collection = new Collection({
      name: "escribano_licenses",
      type: "base",

      // Admin-only create — keys are issued manually
      createRule: null,
      // Admin-only list — prevents key enumeration
      listRule: null,
      // Public view — CLI verifies keys unauthenticated
      viewRule: "",
      // Admin-only update — revoke/change tier manually
      updateRule: null,
      // Admin-only delete
      deleteRule: null,

      fields: [
        // License tier: "beta" or "pro"
        { name: "tier", type: "select", required: true, maxSelect: 1, values: ["beta", "pro"] },
        // Whether the key has been revoked
        { name: "revoked", type: "bool", required: false },
      ],
    });

    return app.save(collection);
  },

  // DOWN — delete the collection
  (app) => {
    const collection = app.findCollectionByNameOrId("escribano_licenses");
    return app.delete(collection);
  }
);
```

2. Verify the file exists and has valid JavaScript syntax.

**Verification**: `node -c /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/infra/pocketbase/pb_migrations/6_create_escribano_licenses.js && echo "SYNTAX OK"`

**Rollback**:
- Created files: `rm -f infra/pocketbase/pb_migrations/6_create_escribano_licenses.js`

### WU-2: Push to main and deploy to production

**Dependencies**: WU-1

**Context**: The migration file must reach the production server for the `escribano_licenses` collection to be created. The production server is accessible via `ssh hzowui` (Hetzner server at 94.130.58.118, user eduardosanzb). The deployment is managed by Coolify which auto-deploys on push to main. After pushing, we SSH in to verify the PocketBase container picked up the new migration and the collection exists.

**Files**:
- (no file changes — operational step only)

**Steps**:

1. Stage and commit the migration file:
   ```
   git add infra/pocketbase/pb_migrations/6_create_escribano_licenses.js
   git commit -m "feat: add escribano_licenses PocketBase collection migration"
   ```

2. Push to main:
   ```
   git push origin main
   ```

3. Wait for Coolify to detect the push and redeploy (typically 2-3 minutes). Then SSH into the server and verify the collection exists:
   ```
   ssh hzowui "curl -sf http://localhost:8090/api/collections/escribano_licenses"
   ```
   If the collection is not yet visible, check if the PocketBase container has restarted:
   ```
   ssh hzowui "docker ps --filter name=pocketbase"
   ```
   If the container hasn't restarted yet, wait another minute and retry. Coolify handles the rebuild and redeploy automatically.

4. Verify the collection schema has the expected fields by checking the API response contains `"tier"` and `"revoked"`.

**Verification**: `ssh hzowui "curl -sf http://localhost:8090/api/collections/escribano_licenses | grep -q 'tier' && grep -q 'revoked'" && echo "DEPLOY OK"`

**Rollback**:
- If the push already happened: `git revert HEAD --no-edit && git push origin main`
- If the push failed: `git reset HEAD~1` (uncommit locally)

## Execution Plan

### Phase 1 — No dependencies

- WU-1: Create escribano_licenses migration

### Phase 2 — Requires Phase 1

- WU-2: Push to main and deploy to production

## Recovery Strategy

- **Automatic**: Each implementor rolls back and retries once on failure.
- **Dependency failure**: If WU-1 fails, WU-2 will not run.
- **Global rollback**: `git reset HEAD~1 --hard` to undo the commit, or `git revert` to undo non-destructively.
- **Independent failures**: N/A — only one unit per phase.
