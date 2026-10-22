#!/bin/sh
# The keys of an installation (#577), before Dwello starts: made once into the volume, kept on every later start.
# A value the operator set in .env wins (older installations), and a database made with the old default password
# «dwello» keeps it. Usage: init-secrets.sh <key directory> <the database's data directory>
set -eu
dir=$1
pgdata=$2
mkdir -p "$dir"

random() { tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 48; }

# the frontend and backend run as their own users and read the keys; only this script writes them
keep() {
	rm -f "$dir/$1"
	printf '%s' "$2" > "$dir/$1"
	chmod 444 "$dir/$1"
}

if [ -n "${JWT_SECRET:-}" ]; then keep jwt_secret "$JWT_SECRET"
elif [ ! -s "$dir/jwt_secret" ]; then keep jwt_secret "$(random)"; fi

if [ -n "${POSTGRES_PASSWORD:-}" ]; then keep db_password "$POSTGRES_PASSWORD"
elif [ ! -s "$dir/db_password" ]; then
	if [ -f "$pgdata/PG_VERSION" ]; then keep db_password dwello; else keep db_password "$(random)"; fi
fi

# stored secrets such as the KI's API key (#580) are encrypted with it; it belongs in the backup
if [ ! -s "$dir/encryption_key" ]; then keep encryption_key "$(random)"; fi
