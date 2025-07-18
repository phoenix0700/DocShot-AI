# Redis Version Fix

## Issue
The worker was showing warnings about Redis version 6.0.16 being too old, even though Docker Compose specified Redis 7.

## Root Cause
- Docker Redis was correctly running version 7.4.5 on port **6380**
- `.env.local` was configured to use port **6379**
- A system Redis instance (version 6.0.16) was running on port 6379
- The worker was connecting to the wrong Redis instance

## Solution
Updated `.env.local` to use the correct port:
```
REDIS_URL=redis://localhost:6380
```

## Action Required
Restart your development server:
```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
pnpm dev
```

## Optional: Stop System Redis
If you don't need the system Redis on port 6379:
```bash
# On Ubuntu/Debian:
sudo systemctl stop redis
sudo systemctl disable redis

# On macOS:
brew services stop redis
```