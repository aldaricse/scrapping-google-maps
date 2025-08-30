# Lockfile Reset for Tailwind v4 Migration

The old pnpm-lock.yaml has been removed to allow Vercel to generate a fresh lockfile with the correct Tailwind v4.0.0 dependencies.

This should resolve the dependency conflicts that were preventing successful builds.

## What happens next:
1. Vercel will run `pnpm install --no-frozen-lockfile`
2. A new lockfile will be generated with Tailwind v4.0.0
3. The build should proceed successfully
