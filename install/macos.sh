#!/usr/bin/env bash
# Installs Dwello on a Mac (#579). Paste into the Terminal app:
#   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/rudini/Dwello/main/install/macos.sh)"
# It installs Homebrew and Docker Desktop if they are missing, puts Dwello into ~/dwello, starts it and opens the browser
# at the setup. Run it again to update Dwello; the data stays. The steps by hand: docs/installation.md.
set -euo pipefail

source_url=${DWELLO_SOURCE:-https://raw.githubusercontent.com/rudini/Dwello/main}
dir="$HOME/dwello"
say() { printf '\n==> %s\n' "$*"; }
fail() { printf '\nDwello installation stopped: %s\nWhat to do: %s\nHelp: https://github.com/rudini/Dwello/blob/main/docs/installation.md\n' "$1" "$2" >&2; exit 1; }
trap 'fail "a step above failed (its message is above)." "fix what it names, then paste the line again; finished steps are skipped."' ERR

# where Homebrew and Docker Desktop put their commands, also before a new Terminal window knows them
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.docker/bin:/Applications/Docker.app/Contents/Resources/bin:$PATH"

if ! docker info >/dev/null 2>&1; then
	if [ ! -d /Applications/Docker.app ]; then
		if ! command -v brew >/dev/null; then
			say "Installing Homebrew (brew.sh), which installs Docker Desktop. It asks for your Mac password and to press Return."
			/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
		fi
		say "Installing Docker Desktop with Homebrew. It may ask for your Mac password."
		brew install --cask docker-desktop
	fi
	say "Starting Docker Desktop. The first time, accept its terms in its window (no account needed; it may ask for your Mac password); this script waits."
	open -a Docker
	for _ in $(seq 300); do docker info >/dev/null 2>&1 && break; sleep 2; done
	docker info >/dev/null 2>&1 || fail "Docker Desktop does not run after 10 minutes." "open Docker Desktop, accept its terms and wait until it says «Engine running», then paste the line again."
fi

[ -d "$dir/.git" ] && fail "$dir is a Git clone of Dwello." "update it as docs/installation.md, «From a clone», says."
say "Downloading Dwello into $dir."
mkdir -p "$dir" && cd "$dir"
curl -fsSLO "$source_url/compose.yaml"

say "Starting Dwello. The first time this downloads about 4 GB and takes a few minutes."
docker compose pull --quiet
docker compose up -d
docker compose up -d --wait --wait-timeout 600 frontend

code=$(docker logs dwello-backend 2>&1 | sed -n 's/.*Einrichtungscode: \([A-Z0-9-]*\).*/\1/p' | tail -1)
say "Dwello runs at http://localhost:3000 and opens in the browser."
[ -z "$code" ] || say "Einrichtungscode for «Dwello einrichten»: $code"
open http://localhost:3000
