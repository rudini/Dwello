#!/bin/sh
# Usage: unshare -m -p -f --mount-proc --propagation private sandbox.sh <dir> <command>...
# Shows <dir> as /workspace, harness/sandbox-env as /sandbox and, if set, $STAGE3_VERIFIER as /verifier
# (both read-only); hides /home/user (the Dwello checkout), /tmp (all runs, reviews, results, tool caches),
# /root/.claude and /root/.cache (other sessions' transcripts, tasks, scratchpads, logs), /mnt and /srv behind
# empty tmpfs mounts; then runs the command in a new user namespace, where those mounts are locked: even
# its root cannot unmount them. The new PID namespace hides every other process (and its /proc/<pid>/root).
set -e
dir="$1"; shift
mount --bind "$dir" /workspace
mount --bind "$(dirname "$0")/sandbox-env" /sandbox
mount -o remount,bind,ro /sandbox
if [ -n "$STAGE3_VERIFIER" ]; then
  mount --bind "$STAGE3_VERIFIER" /verifier
  mount -o remount,bind,ro /verifier
fi
for hidden in /home/user /tmp /root/.claude /root/.cache /mnt /srv; do
  if [ -d "$hidden" ]; then mount -t tmpfs none "$hidden"; fi
done
cd /workspace
exec unshare -U -m --map-root-user "$@"
