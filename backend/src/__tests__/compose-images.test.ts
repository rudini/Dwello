/**
 * Installation without a clone (#578, decided in #497): compose.yaml starts Dwello from the images each release
 * publishes, one file to download; it is docker-compose.prod.yml without the build
 */

import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';

type Service = { image?: string; build?: unknown; ports?: string[]; volumes?: string[]; configs?: unknown; profiles?: string[]; environment?: string[] };
type Compose = { name?: string; version?: string; services: Record<string, Service>; configs?: Record<string, { content: string }> };

const root = join(import.meta.dir, '../../..');
const read = (file: string) => readFileSync(join(root, file), 'utf8');
const published = Bun.YAML.parse(read('compose.yaml')) as Compose;
const built = Bun.YAML.parse(read('docker-compose.prod.yml')) as Compose;

const IMAGE = (part: string) => `ghcr.io/rudini/dwello-${part}:\${DWELLO_VERSION:-latest}`;

describe('Installation mit compose.yaml', () => {
	it('nutzt nur fertige Images und baut nichts', () => {
		expect(Object.values(published.services).filter((service) => service.build)).toEqual([]);
		expect(published.services.frontend.image).toBe(IMAGE('frontend'));
		expect(published.services.backend.image).toBe(IMAGE('backend'));
		// the restore runs the backend's image of the same version (#718)
		expect(published.services.restore.image).toBe(IMAGE('backend'));
	});

	// one file to download: the script that makes the keys comes inside it, not from a clone
	it('bringt das Skript für die Schlüssel mit, gleich wie docker/init-secrets.sh', () => {
		const script = published.configs!['init-secrets'].content.replaceAll('$$', '$');
		expect(script).toBe(read('docker/init-secrets.sh'));
		// ./backups is the data folder Docker makes next to the file; no mount needs a file of the clone
		expect(published.services.secrets.volumes!.filter((volume) => volume.includes('init-secrets'))).toEqual([]);
	});

	// a folder other than «Dwello» keeps the volumes of an installation from a clone
	it('heisst wie eine Installation aus dem Klon, damit die Daten bleiben', () => {
		expect(published.name).toBe('dwello');
	});

	it('veröffentlicht ohne HTTPS nur den Port der Web-App', () => {
		const withPorts = Object.entries(published.services).filter(([, service]) => service.ports && !service.profiles);
		expect(withPorts.map(([name, service]) => [name, service.ports])).toEqual([['frontend', ['3000:3000']]]);
	});

	// #722: on a server, HTTPS comes with the file: COMPOSE_PROFILES=https and the domain in .env start Caddy, which gets
	// and renews the certificate itself, as in deploy/demo
	it('bringt mit dem Profil https einen Caddy mit, der das Zertifikat für die Domain holt', () => {
		const caddy = published.services.caddy;
		expect(caddy.profiles).toEqual(['https']);
		expect(caddy.ports).toEqual(['80:80', '443:443']);
		// a required variable («:?») would stop every installation without the profile: Compose reads all services
		expect(caddy.environment).toContain('DWELLO_DOMAIN=${DWELLO_DOMAIN:-}');
		const caddyfile = published.configs!.caddyfile.content.replaceAll('$$', '$');
		expect(caddyfile).toContain('{$DWELLO_DOMAIN} {');
		expect(caddyfile).toContain('reverse_proxy frontend:3000');
	});

	// #578 CI: busybox wget took «localhost» as ::1 and the web app listens on 0.0.0.0 only, so the frontend stayed unhealthy
	it('prüft die Web-App über 127.0.0.1, wo sie lauscht', () => {
		const checks = [
			(published.services.frontend as { healthcheck: { test: string[] } }).healthcheck.test.join(' '),
			(built.services.frontend as { healthcheck: { test: string[] } }).healthcheck.test.join(' '),
			read('Dockerfile').match(/HEALTHCHECK[^\n]*\n[^\n]*/)![0]
		];
		for (const check of checks) expect(check).toContain('http://127.0.0.1:3000/health');
	});

	// #945: Paraglide fails when the frontend is built under QEMU for arm64; its build is JavaScript and the server loads
	// no native code (pdf.js, with its optional canvas binary, runs in the browser), so only the last stage is per platform
	it('baut das Frontend auf der Plattform des Runners und nur die Laufzeit für jede Zielplattform', () => {
		const stages = [...read('Dockerfile').matchAll(/^FROM (.+) AS (\S+)$/gm)].map(([, from, name]) => [name, from]);
		expect(stages).toEqual([
			['bun', '--platform=$BUILDPLATFORM oven/bun:1-alpine'],
			['deps', '--platform=$BUILDPLATFORM node:26-alpine'],
			['prod-deps', 'deps'],
			['builder', '--platform=$BUILDPLATFORM node:26-alpine'],
			['runner', 'node:26-alpine']
		]);
		expect(read('Dockerfile')).not.toContain('COPY --from=oven/bun');
	});

	// docker-compose.prod.yml stays for installations from a clone: both start the same Dwello
	it('startet dieselben Dienste mit denselben Einstellungen wie docker-compose.prod.yml', () => {
		// a service of a profile (Caddy, #722) is compose.yaml's own: a clone gets HTTPS through deploy/demo/
		const same = ({ services }: Compose) =>
			Object.fromEntries(
				Object.entries(services)
					.filter(([, service]) => !service.profiles)
					.map(([name, { image, build: _build, volumes, configs: _configs, ...rest }]) => [
					name,
					{
						...rest,
						image: name === 'secrets' || /dwello/.test(image ?? '') ? undefined : image,
						volumes: volumes?.filter((volume) => !volume.includes('init-secrets'))
					}
				])
			);
		expect(same(published)).toEqual(same(built));
	});
});
