# Demo deployment (demo.dwello.ch)

The public demo runs on one Oracle Cloud "Always Free" VM: `docker-compose.prod.yml` plus `deploy/demo/docker-compose.yml`, which adds Caddy for HTTPS and publishes no port but 80 and 443. Self-hosting stays as in the main README (`docker-compose.prod.yml` on its own); nothing here changes it.

**Every visitor shares the same data.** Anyone with a Google account can sign in and sees and edits the same demo landlord. A cron job resets the database to the demo data every night (`reset-demo.sh`). `DEMO=on` (set in `docker-compose.yml`) tells visitors so: a notice at the top of every page and a section in the privacy statement.

## 1. VM (Oracle Cloud)

1. Create an Always Free account; home region **Switzerland North (Zurich)**, so the data stays in Switzerland (the home region cannot be changed later).
2. Compute, Instances, Create: image **Ubuntu 24.04** (aarch64), shape **VM.Standard.A1.Flex** with 2 OCPU and 12 GB (the Always Free limit since August 2026), boot volume 50 GB. Add your SSH key.
3. Networking: in the VCN's security list (or a network security group on the instance), add ingress rules for TCP 80 and 443 from `0.0.0.0/0`.
4. Oracle's Ubuntu images block every port but 22 in the VM's own firewall: open 80 and 443 (harmless where Docker already lets its published ports through) and set the time zone for the nightly reset. On the VM:

   ```bash
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
   sudo netfilter-persistent save
   sudo timedatectl set-timezone Europe/Zurich
   ```

5. Install Docker: `curl -fsSL https://get.docker.com | sudo sh`, then `sudo usermod -aG docker $USER` and log in again. Compose 2.24 or newer is needed (`!reset` in the demo file); the script installs a current one.

6. Upgrade the account to **Pay As You Go** (Billing, Upgrade; a credit card is needed, resources within the Always Free limits stay free). Oracle reclaims Always Free instances of free accounts that stay idle for 7 days (95th percentile of CPU, network and memory use below 20 %), which a demo VM always is.

## 2. DNS (Infomaniak)

In the Infomaniak Manager, Domains, `dwello.ch`, DNS zone, add a record:

| Type | Source | Target | TTL |
|---|---|---|---|
| A | `demo` | public IPv4 of the VM | 1 hour |

Check with `dig +short demo.dwello.ch` before starting Caddy: it requests the certificate as soon as it starts, and Let's Encrypt limits failed attempts. The domain stays at Infomaniak; only this subdomain points to the VM.

## 3. Google sign-in

In the Google Cloud Console, APIs & Services, Credentials: an OAuth client of type "Web application" with

- authorized JavaScript origin `https://demo.dwello.ch`
- authorized redirect URI `https://demo.dwello.ch/auth/callback`

On the OAuth consent screen, set the publishing status to **In production**: in "Testing", only the listed test users (at most 100) can sign in. Dwello asks only for e-mail and profile, which needs no Google verification.

Microsoft sign-in is not wired into `docker-compose.prod.yml`; the demo uses Google only.

## 4. Access to the repository

`rudini/Dwello` is private, and GitHub takes no passwords for `git clone`. The VM reads it with a deploy key: an SSH key that may only read this one repository.

```bash
ssh-keygen -t ed25519 -C "dwello-demo-vm" -f ~/.ssh/dwello_deploy -N ""
cat ~/.ssh/dwello_deploy.pub
```

On GitHub, repository **Settings, Deploy keys, Add deploy key**: title `dwello-demo-vm`, paste the printed line, leave **Allow write access** unticked. Then, on the VM:

```bash
cat >> ~/.ssh/config <<'CONF'
Host github.com
  IdentityFile ~/.ssh/dwello_deploy
  IdentitiesOnly yes
CONF
chmod 600 ~/.ssh/config
```

`git pull` uses the same key later. Deleting the deploy key on GitHub ends the VM's access at once.

## 5. Start

```bash
git clone git@github.com:rudini/Dwello.git && cd Dwello
cp deploy/demo/.env.example deploy/demo/.env    # fill in: secrets, Google client, operator
APP_VERSION=$(git describe --tags --match 'v*') docker compose -f docker-compose.prod.yml -f deploy/demo/docker-compose.yml --env-file deploy/demo/.env up -d --build
docker exec dwello-ollama ollama pull qwen2.5:3b
deploy/demo/reset-demo.sh                       # loads the demo data the first time
```

Then open https://demo.dwello.ch. The model runs on the VM's CPU: categorizing an invoice takes a while, and invoice data never leaves the VM.

**Update** by hand: `git pull`, then the same `up -d --build` command, then `docker image prune -f` to remove the replaced images. Section 7 does this on every merge.

## 6. Nightly reset

`crontab -e` on the VM, with the path of your clone:

```cron
0 3 * * * /home/ubuntu/Dwello/deploy/demo/reset-demo.sh >> /home/ubuntu/demo-reset.log 2>&1
```

At 03:00 (Zurich time, step 1.4) the script stops the backend, recreates the database from the migrations, loads the demo data and starts the backend again; for these 20 to 30 seconds the app answers with an error. Sessions stay valid, since they live in cookies.

If the reset fails halfway (the log ends with an error, the app shows no data), run `deploy/demo/reset-demo.sh` again by hand; nothing else notices. Keep the log small with `logrotate` or by replacing `>>` with `>` in the cron line.

## 7. Automatic updates

`update.sh` checks every 5 minutes whether `main` has a commit or version that is not built yet and already has its version tag (the release workflow tags each merge within a minute; an untagged `main` waits for the next run and says so in the log; a version set by hand on the same commit is built too; the first run after the change to `.git/demo-deployed` in #173 builds once more); only then it pulls, rebuilds and restarts the app, migrations included. Building takes 3 to 5 minutes while the old version keeps running; switching takes about a minute without the app (the new backend migrates and must report healthy before the frontend starts). A failed build is tried again on the next run; the first run after adding the cron line builds once, since no build is recorded yet (`.git/demo-deployed`). It needs the clone on `main` (`git checkout main`) and no local changes to tracked files; otherwise `git merge --ff-only` fails on every run and says so in the log. It and the nightly reset share a lock, so they never run at the same time. Add to `crontab -e`:

```cron
*/5 * * * * /home/ubuntu/Dwello/deploy/demo/update.sh >> /home/ubuntu/demo-update.log 2>&1
```

The log holds each update with its commit and the build output, and a line per run while GitHub cannot be reached; keep it small with `logrotate`. A new variable in `.env.example` is not added for you: compare it with your `.env` after an update that needs one.
