#!/usr/bin/env bash
# ============================================================================
# push-to-github.sh — one-command GitHub uploader for the Parmida Zinati site
#
# Usage:
#   bash scripts/push-to-github.sh <github-username> <personal-access-token> [repo-name]
#
# Example:
#   bash scripts/push-to-github.sh parmida ghp_xxxxxxxxxxxx parmida-zinati
#
# The token needs the classic "repo" scope:
#   GitHub → Settings → Developer settings → Personal access tokens (classic)
#
# Notes:
#   • The repository is created (public) via the GitHub API if it doesn't exist.
#   • The token is used only for this push — it is NOT saved into .git/config.
#   • Everything already committed on "main" is uploaded (working tree must be clean).
# ============================================================================
set -euo pipefail

USERNAME="${1:-}"
TOKEN="${2:-}"
REPO="${3:-parmida-zinati}"
BRANCH="main"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

say()  { printf "${BLUE}→${NC} %s\n" "$1"; }
ok()   { printf "${GREEN}✓${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}⚠${NC} %s\n" "$1"; }
die()  { printf "${RED}✗${NC} %s\n" "$1"; exit 1; }

[[ -n "$USERNAME" ]] || die "usage: bash scripts/push-to-github.sh <github-username> <token> [repo-name]"
[[ -n "$TOKEN" ]]    || die "missing token — create one with the 'repo' scope on GitHub"
[[ -d .git ]]        || die "run this script from the project root (where .git lives)"

# ---------------------------------------------------------------------------
# 0. sanity — clean tree, correct branch
# ---------------------------------------------------------------------------
if [[ -n "$(git status --porcelain)" ]]; then
  warn "working tree is not clean — committing everything first"
  git add -A
  git commit -m "chore: snapshot before GitHub upload"
fi

git branch -M "$BRANCH" 2>/dev/null || true

# ---------------------------------------------------------------------------
# 1. create the repository via the GitHub API (skip if it already exists)
# ---------------------------------------------------------------------------
say "checking repository $USERNAME/$REPO on GitHub…"

HTTP_CODE=$(curl -s -o /tmp/gh-repo-check.json -w "%{http_code}" \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$USERNAME/$REPO")

if [[ "$HTTP_CODE" == "200" ]]; then
  ok "repository already exists — reusing it"
else
  say "creating repository $USERNAME/$REPO …"
  HTTP_CODE=$(curl -s -o /tmp/gh-repo-create.json -w "%{http_code}" \
    -X POST "https://api.github.com/user/repos" \
    -H "Authorization: token $TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -d "{\"name\":\"$REPO\",\"description\":\"Personal portfolio of Parmida Zinati — UI/UX designer & founder of Quantum (Next.js, RTL, Persian-first)\",\"private\":false,\"auto_init\":false}")
  [[ "$HTTP_CODE" == "201" ]] || {
    head -c 400 /tmp/gh-repo-create.json; echo
    die "repository creation failed (HTTP $HTTP_CODE) — check the token/scope"
  }
  ok "repository created"
fi

# ---------------------------------------------------------------------------
# 2. remote (without the token) + push (token only in the one-off URL)
# ---------------------------------------------------------------------------
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$USERNAME/$REPO.git"

say "pushing $BRANCH to GitHub …"
if git push "https://x-access-token:$TOKEN@github.com/$USERNAME/$REPO.git" "$BRANCH:$BRANCH" 2>/tmp/gh-push.log; then
  ok "push successful"
else
  cat /tmp/gh-push.log
  die "push failed — see the log above (is the token valid? repo scope? repo empty?)"
fi

# ---------------------------------------------------------------------------
# 3. summary
# ---------------------------------------------------------------------------
echo
ok  "repository : https://github.com/$USERNAME/$REPO"
ok  "clone URL  : https://github.com/$USERNAME/$REPO.git"
echo
say "next step for a shareable Telegram link:"
echo "  Vercel → Add New Project → Import this repo → set ADMIN_PASSCODE → Deploy"
echo "  (you get a permanent link like https://<repo>.vercel.app)"
