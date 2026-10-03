#!/usr/bin/env bash
# ============================================================================
# build-static.sh — GitHub-Pages-compatible static export of the site
#
#   bash scripts/build-static.sh          → produces ./out
#
# What it does:
#   1. temporarily moves the API routes + secret admin panel out of src/app
#      (a static export can neither run nor expose them)
#   2. flips page.tsx from "force-dynamic" to "force-static"
#   3. runs `next build` with STATIC_EXPORT=1 → pure-static ./out
#   4. restores everything exactly as it was (even on build failure)
#
# Deploy (repo: parmidazinati/parmidazinati.github.io — Pages serves main /):
#   rm -rf /tmp/pages && git clone <repo-url> /tmp/pages
#   cd /tmp/pages && git rm -rfq . && touch .nojekyll && cp -r ../my-project/out/* .
#   git add -A && git commit -m "Deploy: portfolio static export" && git push
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."

BACKUP=".static-backup"
rm -rf "$BACKUP"
mkdir -p "$BACKUP"

restore() {
  if [ -d "$BACKUP/api" ]; then
    rm -rf src/app/api
    mv "$BACKUP/api" src/app/api
  fi
  if [ -d "$BACKUP/admin" ]; then
    rm -rf src/app/biayekamnazdikeman
    mv "$BACKUP/admin" src/app/biayekamnazdikeman
  fi
  if [ -f "$BACKUP/page.tsx" ]; then
    mv "$BACKUP/page.tsx" src/app/page.tsx
  fi
  rm -rf "$BACKUP"
}
trap restore EXIT

# 1. route handlers cannot exist in a static export
mv src/app/api "$BACKUP/api"

# 2. never publish the admin panel
if [ -d src/app/biayekamnazdikeman ]; then
  mv src/app/biayekamnazdikeman "$BACKUP/admin"
fi

# 3. force-dynamic breaks the export — flip it for this build only
cp src/app/page.tsx "$BACKUP/page.tsx"
sed -i 's/export const dynamic = "force-dynamic";/export const dynamic = "force-static";/' src/app/page.tsx

# 4. the static build itself
rm -rf out
STATIC_EXPORT=1 NEXT_PUBLIC_STATIC_EXPORT=1 ./node_modules/.bin/next build

echo
echo "✓ static build ready in ./out"
