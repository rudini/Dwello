# Fach-Review #579 (Installer in einer Zeile), Runde 1

Subjekt: `git diff fbee44c8 3b378d05 -- marketing docs/installation.md install`, Worktree `w579-review-installer-fach` (3b378d05).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Auf einem Server ohne Browser schicken Skript, Anleitung und die Reiter Homeserver/Cloud die Person, die einrichtet, auf `http://<Adresse>:3000`. Ohne `.env` lehnt Dwello dort die Einrichtung und die Anmeldung ab, und das Passwort geht vorher unverschlüsselt übers Netz. |
| V-2 | Verwalter | Major | Der Entwurf «Sie brauchen» (Eigener PC) ist unklar («es», «die Zeile») und unvollständig: Es fehlen das Betriebssystem, die Administratorrechte, der Speicherplatz und der Ort, an dem die externe KI eingetragen wird. |
| V-3 | Verwalter | Minor | Reiter Homeserver/Cloud: Der Kommentar «Docker und Dwello installieren» widerspricht «Sie brauchen: … mit Docker» (index.html:620, :638). Auf einem NAS (Synology, Unraid) installiert get.docker.com kein Docker. Fix: Texte unten. |
| V-4 | Verwalter | Minor | Roadmap: «zu den meisten gibt es ein Issue» stimmt nicht mehr, denn nur einer von zwei Punkten hat ein Issue (index.html:740 und i18n). Fix: Text unten. |
| V-5 | Verwalter | Minor | Download-Grösse widersprüchlich: Die Skripte sagen «about 3 GB» (linux.sh:37, macos.sh:37, windows.ps1:138), die Anleitung sagt «about 1 GB, without the AI model» (installation.md:80). Fix: die gemessene Zahl an beiden Stellen. |
| V-6 | Verwalter | Minor | windows.ps1:148: Ein Fehler eines Cmdlets mit `-ErrorAction Stop` (z. B. `Invoke-WebRequest` ohne Internet) meldet nur, was fehlschlug, aber nicht, was zu tun ist. Das verlangt das «Done means» von #579. Fix: im `catch` den Satz «What to do» ergänzen, wenn die Meldung keinen hat (Text unten). |

## V-1 (Major): Einrichtung über die Adresse des Servers scheitert

**Belege**
- `install/linux.sh:43`: «Dwello runs at http://localhost:3000 (from another device: this machine's address, port 3000).»
- `docs/installation.md:22`: «on a server without a browser, open `http://<the server's address>:3000` on another device. For HTTPS, … add the settings of sections 3, 4, 6 and 7 to `~/dwello/.env` and paste the line again.»
- `marketing/index.html` code-home/code-cloud: Erst kommt die Zeile, danach «# HTTPS mit Ihrer Domain: siehe Anleitung».
- Das Skript lädt nur `compose.yaml`, keine `.env`. Dann gilt `compose.yaml`: `ORIGIN=${PUBLIC_APP_URL:-http://localhost:3000}`, `COOKIE_DOMAIN=${COOKIE_DOMAIN:-localhost}` und `COOKIE_SECURE=${COOKIE_SECURE:-true}`.
- Die Einrichtung ist eine Form-Action (`src/routes/setup/+page.server.ts:12`). `svelte.config.js` schaltet die Origin-Prüfung nicht ab.
- Die Anleitung sagt selbst (installation.md, Abschnitt 7): «Dwello accepts the sign-in only at the address in `PUBLIC_APP_URL`.»

**Warum falsch**
- Wer der Anweisung folgt, gibt Einrichtungscode, E-Mail-Adresse und Passwort auf `http://<IP>:3000` ein.
- Der POST wird abgewiesen (Origin ≠ `http://localhost:3000`). Ein Cookie mit `Domain=localhost`/`Secure` setzt der Browser auf dieser Adresse ohnehin nicht.
- Auf einem frischen Cloud-Server ist Port 3000 meist offen. Das Passwort des Kontos, das die Personendaten der Mieter schützt, ging also schon unverschlüsselt durchs Internet, bevor die Anleitung zu HTTPS kommt.
- Die Reihenfolge «erst Zeile, dann HTTPS» ist auf einem Server genau falsch herum.

**Fix**
- Auf einem Server gilt: erst `~/dwello/.env` mit den Werten aus Abschnitt 7 anlegen (das Skript lässt sie stehen und `compose` liest sie), dann die Zeile einfügen.
- Das Skript nennt die Adresse aus `PUBLIC_APP_URL`, falls gesetzt. Sonst sagt es, dass Dwello nur auf diesem Gerät läuft und wie man es auf anderen Geräten öffnet.
- Texte: Zeilen `guide-linux`, `linux-done-*`, `code-home-*`, `code-cloud-*` unten. Die Kommentarzeile «# HTTPS mit Ihrer Domain: siehe Anleitung» bzw. «# HTTPS mit Caddy: siehe Anleitung» entfällt; sie wird durch die erste Zeile ersetzt.

## V-2 (Major): «Sie brauchen» (Eigener PC)

**Beleg:** `marketing/index.html:603` und die drei i18n-Einträge.

**Warum falsch**
- «installiert es die Zeile mit»: Das «es» ist mehrdeutig, und «die Zeile» ist im Panel nicht eingeführt.
- Es fehlt, was die Person vorher klären muss:
  - Windows 10/11, macOS oder Linux (installation.md:16–18);
  - Administratorrechte, die das Skript für Docker, WSL2 und Homebrew verlangt;
  - rund 10 GB Speicherplatz (installation.md:31).
- «tragen Sie eine externe KI ein» sagt nicht, wo. Seit #580 wählt man sie unter «Einstellungen» › «KI», Option «KI eines Anbieters» (`messages/de.json` `ki_settings_provider`).

**Fix:** Zeile `pc-needs` unten.

## Texte

Die Skripte und die Anleitung sind nur Englisch, deshalb steht dort in de/fr/it «–».

| key | de | fr | it | en |
|---|---|---|---|---|
| pc-needs (index.html:603, dd «Sie brauchen») | Einen PC mit Windows 10 oder 11, macOS oder Linux, Administratorrechte und rund 10 GB freien Speicherplatz. Für die lokale KI: 16 GB Arbeitsspeicher. Mit weniger wählen Sie später unter «Einstellungen» › «KI» die «KI eines Anbieters». Die Zeile installiert auch Docker, falls es fehlt. | Un PC sous Windows 10 ou 11, macOS ou Linux, des droits d’administrateur et environ 10 Go d’espace libre. Pour l’IA locale : 16 Go de mémoire vive. Avec moins, choisissez ensuite « IA d’un fournisseur » sous « Paramètres » › « IA ». La ligne installe aussi Docker s’il manque. | Un PC con Windows 10 o 11, macOS o Linux, i diritti di amministratore e circa 10 GB di spazio libero. Per l’IA locale: 16 GB di memoria. Con meno, scelga poi «IA di un fornitore» in «Impostazioni» › «IA». La riga installa anche Docker, se manca. | A PC with Windows 10 or 11, macOS or Linux, administrator rights and about 10 GB of free disk space. For the local AI: 16 GB of memory. With less, later choose «AI of a provider» under «Settings» › «AI». The line also installs Docker if it is missing. |
| code-home-1 (vor der Zeile, ersetzt «# Auf dem Homeserver per SSH: Docker und Dwello installieren») | # Zuerst die Adresse von Dwello in ~/dwello/.env eintragen: Anleitung, Abschnitt 7 | # D’abord, inscrire l’adresse de Dwello dans ~/dwello/.env : guide, section 7 | # Prima inserire l’indirizzo di Dwello in ~/dwello/.env: guida, sezione 7 | # First, put Dwello’s address into ~/dwello/.env: guide, section 7 |
| code-home-2 (direkt vor der Zeile; «# HTTPS mit Ihrer Domain: siehe Anleitung» entfällt) | # Dann per SSH: Docker (falls nötig) und Dwello installieren | # Ensuite, par SSH : installer Docker (si nécessaire) et Dwello | # Poi, tramite SSH: installare Docker (se necessario) e Dwello | # Then, over SSH: install Docker (if needed) and Dwello |
| code-cloud-1 (ersetzt «# Auf einem frischen Linux-Server: Docker und Dwello installieren») | # Zuerst Domain und HTTPS in ~/dwello/.env eintragen: Anleitung, Abschnitt 7 | # D’abord, inscrire le domaine et HTTPS dans ~/dwello/.env : guide, section 7 | # Prima inserire dominio e HTTPS in ~/dwello/.env: guida, sezione 7 | # First, put the domain and HTTPS into ~/dwello/.env: guide, section 7 |
| code-cloud-2 (direkt vor der Zeile; «# HTTPS mit Caddy: siehe Anleitung» entfällt) | # Dann auf dem frischen Linux-Server: Docker und Dwello installieren | # Ensuite, sur le serveur Linux neuf : installer Docker et Dwello | # Poi, sul server Linux nuovo: installare Docker e Dwello | # Then, on the fresh Linux server: install Docker and Dwello |
| home-needs (index.html:620, dd «Sie brauchen») | Einen Mini-PC mit Linux oder ein NAS, auf dem Docker schon läuft. Für den Zugriff von anderen Geräten empfohlen: eine eigene Domain mit HTTPS. Für die lokale KI 16 GB Arbeitsspeicher. | Un mini-PC sous Linux ou un NAS sur lequel Docker tourne déjà. Recommandé pour l’accès depuis d’autres appareils : un domaine à vous avec HTTPS. Pour l’IA locale, 16 Go de mémoire vive. | Un mini-PC con Linux o un NAS su cui Docker è già in funzione. Consigliato per l’accesso da altri dispositivi: un dominio proprio con HTTPS. Per l’IA locale 16 GB di memoria. | A mini PC with Linux, or a NAS that already runs Docker. Recommended for access from other devices: a domain of your own with HTTPS. For the local AI, 16 GB of memory. |
| cloud-needs (index.html:638, dd «Sie brauchen») | Einen Linux-Server und eine eigene Domain. Die Zeile installiert auch Docker. | Un serveur Linux et un domaine à vous. La ligne installe aussi Docker. | Un server Linux e un dominio proprio. La riga installa anche Docker. | A Linux server and a domain of your own. The line also installs Docker. |
| roadmap-intro (index.html:740) | Dwello wird offen weiterentwickelt. Diese Punkte sind geplant. Wo ein Issue auf GitHub verlinkt ist, können Sie dort mitreden. | Dwello est développé ouvertement. Ces points sont prévus. Là où un ticket GitHub est lié, vous pouvez y donner votre avis. | Dwello viene sviluppato apertamente. Questi punti sono previsti. Dove è collegata una segnalazione su GitHub, può dire la Sua lì. | Dwello is developed in the open. These points are planned. Where an issue on GitHub is linked, you can have your say there. |
| guide-linux (installation.md:22, ersetzt den Punkt «Linux») | – | – | – | **Linux server:** Dwello accepts the setup and the sign-in only at the address in `PUBLIC_APP_URL`, which is `http://localhost:3000` by default. On a server you open from other devices, first create `~/dwello/.env` with the settings of section 7 (and of sections 3, 4 and 6 if you need them), then paste the line; it keeps the file. After a later change to `.env`, paste the line again. |
| linux-done-url (linux.sh:43, `PUBLIC_APP_URL` in `.env` gesetzt) | – | – | – | Dwello runs at $url. |
| linux-done-local (linux.sh:43, ohne `PUBLIC_APP_URL`) | – | – | – | Dwello runs at http://localhost:3000 on this machine only. To open it from another device, put its address into ~/dwello/.env (docs/installation.md, section 7) and paste the line again: Dwello accepts the sign-in only at that address. |
| win-catch-todo (windows.ps1:148, wenn die Meldung kein «What to do» enthält) | – | – | – | What to do: fix what the message names (for example the internet connection), then paste the line again. |

## Nicht bestätigt

- **Safari auf dem Mac (vermutlich bestehend, aber jetzt sichtbarer):**
  - `macos.sh:90` öffnet den Standardbrowser, meist Safari.
  - Ohne `.env` gilt `COOKIE_SECURE=true`. Safari setzt laut mehreren Quellen (tauri-apps/tauri#2604, flaviocopes.com 2026) keine Secure-Cookies auf `http://localhost`. Dann wäre die Anmeldung nach der Einrichtung auf dem Mac unmöglich.
  - Den Code habe ich nicht in Safari geprüft. Bitte an `code-reviewer` oder eine Persona mit WebKit geben.
- **Synology/Unraid:**
  - Ob `docker compose` (Plugin, ≥ 2.23.1, das `configs.content` liest) dort vorhanden ist, habe ich nicht bestätigt.
  - `linux.sh:30` prüft nur, ob es das Plugin gibt, nicht die Version. Der Hinweis «docker-compose-plugin» passt auf diesen Systemen nicht.
  - Gesucht habe ich nur in der Anleitung (Abschnitt 1) und in `compose.yaml`.
- **Download-Grösse (V-5):** Welche Zahl (1 GB oder 3 GB) stimmt, konnte ich nicht messen.
- **Passwortabfrage auf dem Mac:** Ob Docker Desktop beim ersten Start (macos.sh:71) nach dem Mac-Passwort fragt (privileged helper), konnte ich nicht bestätigen. Falls ja, muss die Meldung es vorher sagen («Done means» #579).
- **Windows, abgelehnte UAC-Abfrage:** Ob windows.ps1:112 nach einer abgelehnten UAC-Abfrage trotzdem «Restart Windows now…» meldet, habe ich nicht geprüft (Code, nicht Wortlaut).
- **Windows-Mindestversion:** Docker Desktop verlangt eine Mindestversion von Windows 10/11 (Build). Die Angabe «Windows 10, 11» habe ich nicht gegen docs.docker.com geprüft.

Geprüft: Hinweis «Anmeldung mit Passwort» ohne den Satz zum Installer; die Roadmap ohne #579; README ohne #497; «Quelltext»-Links und aria-labels in allen vier Sprachen; Begriffe Einrichtungscode/«Dwello einrichten»/KI gemäss i18n-begriffe.md:148–153; die Meldungen vor sudo, Administratorrechten und Homebrew (linux.sh:18/24, macos.sh:65/68, windows.ps1:111/119); die Kopierfunktion entfernt «$ »; Datenschutzerklärung: kein neuer Datenfluss aus der App (die Skripte laden nur von GitHub, get.docker.com, brew.sh und winget, nicht aus Dwello), also keine Fedlex-Prüfung nötig.
