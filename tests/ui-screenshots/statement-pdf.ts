/**
 * Screenshots of the statement PDF (CI job ui-screenshots): a fixed example in German and French, drawn by the
 * backend's PDF code of this branch and, with UI_BASE_DIR, of the base branch; every page as PNG, changes framed in
 * red. Run with bun from the repository root; needs pdftoppm (poppler-utils). Writes ui-screenshots/pdf_<lang>_<page>.png
 */

import { spawnSync } from 'child_process';
import { appendFileSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { changedAreas, looksTheSame, markAreas } from './changed-areas';

const LANGUAGES = ['de', 'fr'] as const;
type Language = (typeof LANGUAGES)[number];

const config = {
	iban: 'CH4431999123000889012',
	companyName: 'Muster Immobilien AG',
	address: 'Bahnhofstrasse 1',
	postalCode: '8001',
	city: 'Zürich'
};

// Names as the app prints them in the tenant's language
const WORDS = {
	de: {
		units: 'Wohnungen',
		byUnit: 'Pro Einheit',
		byArea: 'Pro Fläche (m²)',
		mixed: 'Heizung (Fläche 70% / Einheit 30%)',
		categories: ['Lift', 'Hauswart', 'Kaltwasser', 'Allgemeinstrom', 'Gartenpflege', 'Kehricht', 'Heizung', 'Kaminfeger'],
		profile: 'Heizung Mittelland',
		tenant: { firstName: 'Hans', lastName: 'Müller' }
	},
	fr: {
		units: 'logements',
		byUnit: 'Par unité',
		byArea: 'Par surface (m²)',
		mixed: 'Chauffage (surface 70% / unité 30%)',
		categories: ['Ascenseur', 'Conciergerie', 'Eau froide', 'Électricité parties communes', 'Jardinage', 'Ordures', 'Chauffage', 'Ramoneur'],
		profile: 'Chauffage Plateau',
		tenant: { firstName: 'Marie', lastName: 'Dubois' }
	}
};

/** The demo statement Musterhaus 2025 (apartment 1.01): mixed heating key, tank, management fee, payment part */
function example(language: Language) {
	const w = WORDS[language];
	const area = '75.50 / 492.50 m²';
	const unit = `1 / 6 ${w.units}`;
	const days = { periodShare: 1 };
	const lines: [string, string, number, number, object?][] = [
		[w.byUnit, unit, 1690, 281.67],
		[w.byArea, area, 3680, 564.14],
		[w.byArea, area, 3840, 588.67],
		[w.byArea, area, 762.8, 116.94],
		[w.byArea, area, 935, 143.34],
		[w.byUnit, unit, 990, 165],
		[w.mixed, `70 % × ${area}\n+ 30 % × ${unit}`, 6957.8, 1094.53, { byProfile: true }],
		[w.byArea, area, 335, 51.36, { byProfile: true }]
	];
	return {
		id: '5f1c2a9e-0b7d-4c1e-9a3f-2d6b8e4c7a10',
		statementNumber: 'NK-11111111-2025-0001',
		statementDate: '2026-09-28',
		paymentDeadline: '2026-10-28',
		periodStart: '2025-01-01',
		periodEnd: '2025-12-31',
		rentalStart: '2025-01-01',
		rentalEnd: '2025-12-31',
		rentalDays: 365,
		periodDays: 365,
		tenant: { ...w.tenant, address: 'Bahnhofstrasse 42', postalCode: '8001', city: 'Zürich' },
		apartment: { number: '1.01', floor: 1, area: '75.50' },
		building: { name: 'Musterhaus Zentrum', address: 'Bahnhofstrasse 42', place: '8001 Zürich' },
		lineItems: lines.map(([key, keyShare, totalAmount, share, extra], i) => ({
			category: w.categories[i],
			key,
			keyShare,
			totalAmount,
			apartmentShare: share,
			...days,
			tenantShare: share,
			...extra
		})),
		heating: { profile: w.profile, percent: 100 },
		fuel: { category: w.categories[6], openingDate: '2024-12-31', opening: 2650, invoices: 6565, closingDate: '2025-12-31', closing: 2257.2, total: 6957.8 },
		subtotal: 3005.65,
		managementFee: 90.17,
		managementFeePercent: 3,
		managementFeeBase: 3005.65,
		totalCosts: 3095.82,
		totalAdvancePayments: 2880,
		balance: 215.82
	};
}

const scratch = mkdtempSync(join(tmpdir(), 'statement-pdf-'));

// The pages of the example as PNG files, drawn by the PDF code of the given checkout; none if it cannot draw it
async function pages(checkout: string, language: Language, name: string): Promise<Buffer[]> {
	try {
		const { generateStatementPDFBase64 } = await import(resolve(checkout, 'backend/src/services/pdf.service.ts'));
		const pdf = join(scratch, `${name}.pdf`);
		writeFileSync(pdf, Buffer.from(await generateStatementPDFBase64(example(language), config, language), 'base64'));
		const run = spawnSync('pdftoppm', ['-r', '100', '-png', pdf, join(scratch, name)]);
		if (run.status !== 0) throw new Error(String(run.stderr || run.error));
		return readdirSync(scratch)
			.filter((file) => file.startsWith(`${name}-`) && file.endsWith('.png'))
			.sort()
			.map((file) => readFileSync(join(scratch, file)));
	} catch (error) {
		console.error(`${checkout}: ${(error as Error).message}`);
		return [];
	}
}

mkdirSync('ui-screenshots', { recursive: true });
for (const language of LANGUAGES) {
	const after = await pages('.', language, `after-${language}`);
	const before = process.env.UI_BASE_DIR ? await pages(process.env.UI_BASE_DIR, language, `before-${language}`) : [];
	if (!after.length) throw new Error(`The statement PDF (${language}) could not be drawn`);
	after.forEach((page, i) => {
		const file = `ui-screenshots/pdf_${language}_${i + 1}`;
		const old = before[i];
		// no screenshot; the comment names the page as unchanged
		if (old && looksTheSame(old, page)) return appendFileSync('ui-screenshots/unchanged.txt', `pdf_${language}_${i + 1}\n`);
		if (old) writeFileSync(`${file}.before.png`, old);
		writeFileSync(`${file}.png`, old ? markAreas(page, changedAreas(old, page)) : page);
		console.log(`${file}.png`);
	});
}
