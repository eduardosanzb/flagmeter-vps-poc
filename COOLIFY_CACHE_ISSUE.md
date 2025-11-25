# Coolify Docker Cache Issue - RESOLVED

## Problem
Coolify's Docker build was using cached layers that still contained deleted demo files, causing build failures:
```
Could not load /app/apps/dashboard/src//components/ui/input 
(imported by src/components/demo.FormComponents.tsx)
```

## Why This Happened
1. Demo files were deleted in commit `e8ccb4c`
2. Coolify's Docker build cache retained the old `COPY apps/dashboard` layer
3. The cached layer still had the demo files, causing import errors

## Solution

### Option 1: Force Rebuild in Coolify UI (RECOMMENDED)
1. Go to: https://cool.eduardosanzb.dev/
2. Navigate to your FlagMeter project
3. Select the **dashboard** service
4. Click "Redeploy" or "Force Rebuild"
5. **Enable "Build without cache"** option
6. Start the build

### Option 2: Delete Build Cache via Coolify CLI/API
If available, use Coolify's CLI or API to clear the build cache for the dashboard service.

### Option 3: Wait for Natural Cache Invalidation
The next commit that changes any file before the `COPY apps/dashboard` line in the Dockerfile will invalidate the cache naturally.

## Prevention
- Coolify should automatically detect file deletions, but Docker layer caching can mask this
- For major refactors that delete files, always rebuild without cache
- Consider adding cache-busting build args for critical changes

## Verification
After rebuilding without cache, the build should succeed. You can verify by checking:
1. Build logs show all layers being rebuilt (not using cache)
2. Build completes without import errors
3. Dashboard service starts successfully

## Current State (2025-11-25 23:06 CET)
- ✅ Demo files deleted: commit `e8ccb4c`
- ✅ Local Docker build works (tested)
- ✅ Code pushed to GitHub
- ⏳ Waiting for Coolify rebuild without cache
