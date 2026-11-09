#!/usr/bin/env bash
# Installs Dwello on Linux (Debian, Ubuntu, Fedora, CentOS, Raspberry Pi OS) (#579). Paste into a terminal:
#   bash -c "$(curl -fsSL https://raw.githubusercontent.com/rudini/Dwello/main/install/linux.sh)"
# It installs Docker if it is missing, puts Dwello into ~/dwello, starts it and opens the browser at the setup.
# Run it again to update Dwello; the data stays. The steps by hand: docs/installation.md.
set -euo pipefail

source_url=${DWELLO_SOURCE:-https://raw.githubusercontent.com/rudini/Dwello/main}
dir="$HOME/dwello"
say() { printf '\n==> %s\n' "$*"; }
fail() { printf '\nDwello installation stopped: %s\nWhat to do: %s\nHelp: https://github.com/rudini/Dwello/blob/main/docs/installation.md\n' "$1" "$2" >&2; exit 1; }
trap 'fail "a step above failed (its message is above)." "fix what it names, then paste the line again; finished steps are skipped."' ERR

sudo=
[ "$(id -u)" -eq 0 ] || sudo=sudo

if ! command -v docker >/dev/null; then
	say "Installing Docker with Docker's own script (get.docker.com). It asks for your password (sudo)."
	curl -fsSL https://get.docker.com | $sudo sh
fi

docker=docker
if ! docker info >/dev/null 2>&1; then
	say "Starting Docker, or reaching it with sudo. It may ask for your password."
	$sudo systemctl enable --now docker 2>/dev/null || $sudo service docker start >/dev/null || true
	docker="$sudo docker"
	for _ in $(seq 60); do $docker info >/dev/null 2>&1 && break; sleep 2; done
	$docker info >/dev/null 2>&1 || fail "Docker does not start." "start it (sudo systemctl start docker), then paste the line again."
fi
$docker compose version >/dev/null 2>&1 || fail "Docker Compose is missing." "install Docker's package docker-compose-plugin (docs.docker.com/compose/install/linux), then paste the line again."

[ -d "$dir/.git" ] && fail "$dir is a Git clone of Dwello." "update it as docs/installation.md, «From a clone», says."
say "Downloading Dwello into $dir."
mkdir -p "$dir" && cd "$dir"
curl -fsSLO "$source_url/compose.yaml"

say "Starting Dwello. The first time this downloads about 4 GB and takes a few minutes."
$docker compose pull --quiet
$docker compose up -d
$docker compose up -d --wait --wait-timeout 600 frontend

code=$($docker logs dwello-backend 2>&1 | sed -n 's/.*Einrichtungscode: \([A-Z0-9-]*\).*/\1/p' | tail -1)
url=$(sed -n 's/^PUBLIC_APP_URL=//p' .env 2>/dev/null | tail -1)
if [ -n "$url" ]; then say "Dwello runs at $url."
else say "Dwello runs at http://localhost:3000 on this machine only. To open it from another device, put its address into ~/dwello/.env (docs/installation.md, section 7) and paste the line again: Dwello accepts the sign-in only at that address."; fi
[ -z "$code" ] || say "Einrichtungscode for «Dwello einrichten»: $code"
if command -v xdg-open >/dev/null && [ -n "${DISPLAY:-}${WAYLAND_DISPLAY:-}" ]; then xdg-open "${url:-http://localhost:3000}" >/dev/null 2>&1 || true; fi
