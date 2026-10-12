#!/bin/sh
# Usage (inside `unshare -m --propagation private`): sandbox.sh <dir> <command>...
# Shows <dir> as /workspace and hides the Dwello checkout, the session scratchpad (all other runs,
# reviews and results) and other sessions' transcripts, then runs the command in /workspace.
set -e
dir="$1"; shift
mount --bind "$dir" /workspace
for hidden in /home/user /tmp/claude-0/-home-user-Dwello /root/.claude/projects /root/.claude/shell-snapshots; do
  if [ -d "$hidden" ]; then mount -t tmpfs none "$hidden"; fi
done
cd /workspace
exec "$@"
