/**
 * Installation without a clone (#578, decided in #497): compose.yaml starts Dwello from the images each release
 * publishes, one file to download; it is docker-compose.prod.yml without the build
 */

import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';

type Service = { image?: string; build?: unknown; ports?: string[]; volumes?: string[]; configs?: unknown };
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

	it('veröffentlicht nur den Port der Web-App', () => {
		const withPorts = Object.entries(published.services).filter(([, service]) => service.ports);
		expect(withPorts.map(([name, service]) => [name, service.ports])).toEqual([['frontend', ['3000:3000']]]);
	});

	// docker-compose.prod.yml stays for installations from a clone: both start the same Dwello
	it('startet dieselben Dienste mit denselben Einstellungen wie docker-compose.prod.yml', () => {
		const same = ({ services }: Compose) =>
			Object.fromEntries(
				Object.entries(services).map(([name, { image, build: _build, volumes, configs: _configs, ...rest }]) => [
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
