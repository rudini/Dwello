#!/bin/bash
# Maps the Chromium revision the project's Playwright expects to the newest build in the image (#792):
# pw-shim.sh <image folder> <wanted revision> <shim folder>. Finds the executables in whatever subfolder the build
# keeps them; when one is missing it says so, links nothing and exits 1.
set -euo pipefail
installed=$1 want=$2 shim=$3

have=$(ls -d "$installed"/chromium_headless_shell-* 2>/dev/null | sed 's/.*-//' | sort -n | tail -1 || true)
find_exe() { [ -n "$have" ] && find "$installed/$1-$have" -type f -perm -u+x \( -name "$2" -o -name "${3:-$2}" \) 2>/dev/null | head -1; }
headless=$(find_exe chromium_headless_shell chrome-headless-shell headless_shell || true)
chrome=$(find_exe chromium chrome || true)
if [ -z "$headless" ] || [ -z "$chrome" ]; then
	echo "session-start: E2E: no Chromium found in $installed (build ${have:-none}); Playwright will not start a browser (#792)."
	exit 1
fi

mkdir -p "$shim/chromium_headless_shell-$want/chrome-headless-shell-linux64" "$shim/chromium-$want/chrome-linux64"
ln -sfn "$headless" "$shim/chromium_headless_shell-$want/chrome-headless-shell-linux64/chrome-headless-shell"
ln -sfn "$chrome" "$shim/chromium-$want/chrome-linux64/chrome"
for dir in "chromium_headless_shell-$want" "chromium-$want"; do
	touch "$shim/$dir/INSTALLATION_COMPLETE" "$shim/$dir/DEPENDENCIES_VALIDATED"
done
for ffmpeg in "$installed"/ffmpeg-*; do [ -e "$ffmpeg" ] && ln -sfn "$ffmpeg" "$shim/$(basename "$ffmpeg")"; done
exit 0
