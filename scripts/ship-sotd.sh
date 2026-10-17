#!/usr/bin/env bash
# SOTD release (run from Git Bash: bash scripts/ship-sotd.sh): tag the current production first, then the branch, then main. As mediawave-dev with
# a per-command credential helper (never gh auth switch, never a force push to main).
set -e
cd "G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/sotd-20261017-dbce51"
PUSH() { git -c credential.helper= -c 'credential.helper=!f() { echo username=mediawave-dev; echo "password=$(gh auth token -u mediawave-dev)"; }; f' push origin "$@"; }

git fetch origin
BASE=$(git rev-parse --short origin/main)
echo "origin/main: $BASE"
if [ "$BASE" != "c718588" ]; then echo "STOP: origin/main moved to $BASE"; exit 2; fi
git merge-base --is-ancestor origin/main HEAD || { echo "STOP: HEAD does not contain origin/main"; exit 2; }
echo "commits to ship: $(git rev-list --count origin/main..HEAD)"

git tag -f prod-before-sotd c718588
PUSH refs/tags/prod-before-sotd
echo "tag pushed"
PUSH HEAD:refs/heads/sotd/20261017
echo "branch pushed"
PUSH HEAD:refs/heads/main
echo "main pushed: $(git rev-parse --short HEAD)"
