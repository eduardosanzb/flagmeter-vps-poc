# Implementation Plan: PocketBase Self-Built Dockerfile

**Date**: 2026-03-25
**Status**: IN PROGRESS

## Overview

PocketBase does not publish a Docker image to any registry — it only ships pre-compiled binaries
via GitHub Releases. The current compose files reference `ghcr.io/pocketbase/pocketbase:latest`
which fails with `denied`. This plan replaces that non-existent image reference with a small
`Dockerfile` that downloads the correct binary at build time, using Docker BuildKit's automatic
`TARGETARCH` argument for multi-architecture support (arm64 for local Mac + Hetzner CAX, amd64 for
Intel CI runners).

## Scope

- Work units: 3
- Execution phases: 2
- Files affected:
  - `infra/pocketbase/Dockerfile` *(new)*
  - `compose.dev.yml` *(modify — pocketbase service)*
  - `raus.cloud.yaml` *(modify — pocketbase service)*

---

## Work Units

### WU-1: Create infra/pocketbase/Dockerfile

**Dependencies**: none

**Context**: PocketBase only distributes binaries from GitHub Releases
(https://github.com/pocketbase/pocketbase/releases). The latest version is v0.36.7. The binary
zip names follow the pattern `pocketbase_<version>_linux_<arch>.zip` where arch is `amd64` or
`arm64`. Docker BuildKit automatically sets the `TARGETARCH` build argument to the target
platform's architecture, so declaring `ARG TARGETARCH` is all that is needed — no manual
`--build-arg` required. The `WORKDIR` must be `/pb` because both compose files mount migrations
at `/pb/pb_migrations` and PocketBase looks for `./pb_migrations` relative to its working
directory. The base image must include `wget`, `unzip`, and `ca-certificates` (needed to verify
the GitHub HTTPS download).

**Files**:
- `infra/pocketbase/Dockerfile` — create

**Steps**:
1. Create the file `infra/pocketbase/Dockerfile` with the following exact content:

```dockerfile
FROM alpine:3.19

ARG PB_VERSION=0.36.7
ARG TARGETARCH

RUN apk add --no-cache wget unzip ca-certificates

RUN wget -q \
    "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${TARGETARCH}.zip" \
    -O /tmp/pb.zip \
    && unzip /tmp/pb.zip -d /pb/ \
    && rm /tmp/pb.zip \
    && chmod +x /pb/pocketbase

WORKDIR /pb

EXPOSE 8090

CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
```

**Verification**: `test -f infra/pocketbase/Dockerfile && grep -q 'TARGETARCH' infra/pocketbase/Dockerfile && echo VALID`

**Rollback**:
- Created file: `rm -f infra/pocketbase/Dockerfile`

---

### WU-2: Update compose.dev.yml — pocketbase build instead of image

**Dependencies**: WU-1

**Context**: `compose.dev.yml` currently has `image: ghcr.io/pocketbase/pocketbase:latest` for
the `pocketbase` service (line 143). This image does not exist on GHCR — PocketBase only ships
binaries. WU-1 creates `infra/pocketbase/Dockerfile`. This WU replaces the `image:` line with a
`build:` block pointing at that Dockerfile. All other pocketbase service settings (command, ports,
volumes, healthcheck, networks) remain unchanged. The `landing` service was already added to this
file in a prior session and must not be touched.

**Files**:
- `compose.dev.yml` — modify

**Steps**:
1. In `compose.dev.yml`, find the `pocketbase:` service block. It currently starts with:
   ```yaml
     pocketbase:
       image: ghcr.io/pocketbase/pocketbase:latest
   ```
2. Replace the single `image:` line with a `build:` block:
   ```yaml
     pocketbase:
       build:
         context: ./infra/pocketbase
         dockerfile: Dockerfile
   ```
   The line immediately after (`container_name: flagmeter-pocketbase-dev`) and all remaining
   lines of the service must remain exactly as they are.

**Verification**: `docker compose -f compose.dev.yml config --quiet && echo VALID`

**Rollback**:
- `git checkout -- compose.dev.yml`

---

### WU-3: Update raus.cloud.yaml — pocketbase build instead of image

**Dependencies**: WU-1

**Context**: `raus.cloud.yaml` is the Coolify production compose file. It currently has
`image: ghcr.io/pocketbase/pocketbase:latest` for the `pocketbase` service (line 19). The
`landing` service in this same file already uses a `build:` block (`context: apps/landing`,
`dockerfile: Dockerfile`) — follow the same pattern for pocketbase. The build context path must
be relative to the repo root where Coolify runs `docker stack deploy`. All other pocketbase
service settings (command, volumes, healthcheck, `resources:` section, `volumes:` section) must
remain unchanged. Note: `raus.cloud.yaml` uses `version: '1.0'` (Coolify-specific format, not
standard Docker Compose) — do not change this.

**Files**:
- `raus.cloud.yaml` — modify

**Steps**:
1. In `raus.cloud.yaml`, find the `pocketbase:` service block. It currently starts with:
   ```yaml
     pocketbase:
       image: ghcr.io/pocketbase/pocketbase:latest
       command: ["./pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
   ```
2. Replace only the `image:` line with a `build:` block, keeping `command:` and all other lines
   exactly as they are:
   ```yaml
     pocketbase:
       build:
         context: infra/pocketbase
         dockerfile: Dockerfile
       command: ["./pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
   ```
   Note: no leading `./` on `context: infra/pocketbase` — match the style of the `landing`
   service above it which uses `context: apps/landing` (no `./`).

**Verification**: `grep -q 'context: infra/pocketbase' raus.cloud.yaml && ! grep -q 'ghcr.io' raus.cloud.yaml && echo VALID`

**Rollback**:
- `git checkout -- raus.cloud.yaml`

---

## Execution Plan

### Phase 1 — Sequential (no dependencies)
- WU-1: Create infra/pocketbase/Dockerfile

### Phase 2 — Parallel (requires Phase 1)
- WU-2: Update compose.dev.yml pocketbase service
- WU-3: Update raus.cloud.yaml pocketbase service

---

## Recovery Strategy

- **Automatic**: Each implementor rolls back and retries once on failure.
- **Dependency failure**: If WU-1 fails, WU-2 and WU-3 are skipped (they reference the Dockerfile).
- **Global rollback**:
  ```bash
  rm -f infra/pocketbase/Dockerfile
  git checkout -- compose.dev.yml raus.cloud.yaml
  ```
- **Independent failures**: WU-2 and WU-3 are independent of each other — if one fails, the
  other still runs.
