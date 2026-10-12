#!/bin/sh
# Usage: unshare -m -p -f --mount-proc --propagation private sandbox.sh <dir> <command>...
# Shows <dir> as /workspace, harness/sandbox-env as /sandbox and, if set, $STAGE3_VERIFIER (the skill's
# locked scripts) as /verifier, both read-only. Hides behind empty tmpfs mounts: /home/user (the Dwello
# checkout), /tmp (all runs, reviews, results, tool caches), /root/.claude and /root/.cache (other sessions'
# transcripts, tasks, scratchpads, logs), the other dot-directories and dotfiles of /root that hold tool
# credentials and logs (.npm, .ssh, .aws, .config, .local, .gitconfig, .boto, .netrc, .npmrc), /mnt and /srv.
# (The Claude Code credentials under /home/claude, /root/.claude.json and the proxy CA under /root/.ccr stay
# visible: the session needs them to authenticate and to reach its API.) Then runs the command in a new user
# namespace, where these mounts are locked: even its root cannot unmount them. The new PID namespace hides
# every other process (and its /proc/<pid>/root).
set -e
dir="$1"; shift
mount --bind "$dir" /workspace
mount --bind "$(dirname "$0")/sandbox-env" /sandbox
mount -o remount,bind,ro /sandbox
if [ -n "$STAGE3_VERIFIER" ]; then
  mount --bind "$STAGE3_VERIFIER" /verifier
  mount -o remount,bind,ro /verifier
fi
for hidden in /home/user /tmp /root/.claude /root/.cache /root/.npm /root/.ssh /root/.aws /root/.config \
  /root/.local /mnt /srv; do
  if [ -d "$hidden" ]; then mount -t tmpfs none "$hidden"; fi
done
for hidden in /root/.gitconfig /root/.boto /root/.netrc /root/.npmrc; do
  if [ -f "$hidden" ]; then mount --bind /dev/null "$hidden"; fi
done
cd /workspace
exec unshare -U -m --map-root-user "$@"
