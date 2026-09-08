#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

: "${LOCHNER_IPNS_KEY_NAME:=lochner-tech}"

if [ -z "${IPFS_PATH:-}" ] && [ -n "${IPFS_HOME:-}" ]; then
  export IPFS_PATH="$IPFS_HOME/repo"
fi

if [ -n "${IPFS_BIN:-}" ]; then
  ipfs_bin="$IPFS_BIN"
elif [ -n "${IPFS_HOME:-}" ] && [ -x "$IPFS_HOME/kubo/ipfs" ]; then
  ipfs_bin="$IPFS_HOME/kubo/ipfs"
elif command -v ipfs >/dev/null 2>&1; then
  ipfs_bin="$(command -v ipfs)"
else
  echo "ERROR: ipfs was not found." >&2
  echo "Install Kubo/IPFS, add ipfs to PATH, set IPFS_BIN, or set IPFS_HOME to the directory containing kubo/ipfs." >&2
  exit 127
fi

echo "Building Lochner Technology IPFS bundle"
npm run export:ipfs

CID="$($ipfs_bin add -Qr --cid-version=1 dist-ipfs | tail -n1)"
echo "Pinned CID: $CID"
$ipfs_bin pin add "$CID"

key_lines="$($ipfs_bin key list -l)"
key_id="$(printf '%s\n' "$key_lines" | awk -v name="$LOCHNER_IPNS_KEY_NAME" '$2 == name { print $1; exit }')"

if [ -z "$key_id" ]; then
  echo "IPNS key '$LOCHNER_IPNS_KEY_NAME' was not found; generating it now."
  key_id="$($ipfs_bin key gen --type=rsa --size=2048 "$LOCHNER_IPNS_KEY_NAME")"
fi

echo "Publishing /ipfs/$CID to /ipns/$key_id using key '$LOCHNER_IPNS_KEY_NAME'"
$ipfs_bin name publish --key="$LOCHNER_IPNS_KEY_NAME" "/ipfs/$CID"

echo
echo "Published IPFS CID: $CID"
echo "IPNS ID: $key_id"
echo "Local gateway: http://127.0.0.1:8080/ipns/$key_id/"
echo "Public gateway: https://ipfs.io/ipns/$key_id/"
