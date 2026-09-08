#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

node scripts/update-html-timestamps.js

if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git was not found." >&2
  exit 127
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm was not found." >&2
  exit 127
fi

unexpected_changes="$({ git status --porcelain | grep -Ev '^ M (index\.html|alfmir\.ai\.html|lochner-apparel\.html)$' || true; })"
if [ -n "$unexpected_changes" ]; then
  echo "ERROR: The working tree must be clean before preparing an IPFS release." >&2
  echo "Commit, stash, or discard the current changes, then run this command again." >&2
  git status --short >&2
  exit 1
fi

echo "Staging updated HTML Unix timestamp comments"
git add index.html alfmir.ai.html lochner-apparel.html

echo
echo "Generating ipfs-version.json for $(git rev-parse HEAD)"
LOCHNER_GIT_REVISION_DIRTY=false npm run generate:ipfs-version
git add ipfs-version.json

if git diff --cached --quiet; then
  echo "IPFS release metadata is already current; no commit is needed."
else
  git commit -m "Update IPFS release metadata" -- \
    index.html alfmir.ai.html lochner-apparel.html ipfs-version.json
fi

echo
echo "Updating the current branch"
git pull --rebase

echo
echo "Pushing the current branch"
git push
