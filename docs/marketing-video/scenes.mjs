// The app scenes of the marketing videos (#1445), each one or two clips in build/marketing-video/clips/.
//   node docs/marketing-video/scenes.mjs gwr upload statements reports   (stack.sh: demo data and a real KI)
//   node docs/marketing-video/scenes.mjs setup                           (persona-stack.sh --fresh, see README)
//   node docs/marketing-video/scenes.mjs mobile                          (stack.sh again: the vertical cut)
// fallow-ignore-file unused-file
/* global process -- Node global; document -- in page.waitForFunction */
/* global document */
import { launch, record, BUILD } from './rec.mjs';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';

// the demo building Alpenblick: its 2025 statements are not made yet, and it lacks the invoices invoices.mjs writes
const ALPENBLICK = '33333333-3333-3333-3333-333333333333';
const INVOICES = BUILD + 'invoices/';
const PHOTOS = BUILD + 'photos/';
const tid = (page, id) => page.getByTestId(id);
const notReading = (page) =>
	page.waitForFunction(() => !document.body.innerText.includes('Wird gelesen'), null, { timeout: 280000 });

/** The statement's PDF as one PNG per page in <BUILD>/<dir>/ */
async function savePdf(h, statementUrl, dir) {
	const { page } = h;
	await page.goto(statementUrl);
	const create = tid(page, 'statement-generate-pdf-button');
	if (await create.isVisible()) await create.click();
	const link = tid(page, 'statement-pdf-download');
	await link.waitFor({ timeout: 60000 });
	const pdf = await page.request.get(await link.getAttribute('href'));
	rmSync(BUILD + dir, { recursive: true, force: true });
	mkdirSync(BUILD + dir, { recursive: true });
	writeFileSync(`${BUILD}${dir}/statement.pdf`, await pdf.body());
	execFileSync('pdftoppm', ['-r', '200', '-png', `${BUILD}${dir}/statement.pdf`, `${BUILD}${dir}/p`]);
}

// Chooses the building and the files, and returns once the KI has read them
async function chooseInvoices(h, files) {
	const { page } = h;
	await h.click(tid(page, 'invoice-upload-button'), { ms: 900 });
	await h.wait(900);
	await h.moveTo(tid(page, 'invoice-upload-building-select'), { ms: 800 });
	await h.wait(300);
	await tid(page, 'invoice-upload-building-select').selectOption(ALPENBLICK);
	await h.wait(800);
	const chooser = page.waitForEvent('filechooser');
	await h.click(tid(page, 'invoice-upload-file-choose'), { ms: 800 });
	await (await chooser).setFiles(files);
	await page.getByText('Wird gelesen').first().waitFor();
}

// Opens the file's row, shows what the KI read, chooses a Verteilschlüssel where Dwello proposes none
async function checkRow(h, name, { linger }) {
	const row = tid(h.page, 'invoice-upload-row').filter({ hasText: name });
	await h.click(row.getByTestId('invoice-upload-row-toggle'), { ms: 900 });
	await h.wait(800);
	if (linger) {
		await h.moveTo(row.getByTestId('invoice-amount-input'), { ms: 1000 });
		await h.wait(1300);
	}
	await h.moveTo(row.getByTestId('invoice-category-select'), { ms: 800 });
	await h.wait(linger ? 1300 : 800);
	const key = row.getByTestId('invoice-distribution-key-select');
	if ((await key.inputValue()) === '') {
		await h.moveTo(key, { ms: 700 });
		await key.selectOption({ label: 'Pro Fläche (m²)' });
		await h.wait(800);
	}
	return row;
}

// The five steps for Alpenblick 2025, up to the drafts; `look` scrolls through the preview
async function generateStatements(h, look) {
	const { page } = h;
	const next = () => page.getByRole('button', { name: 'Weiter', exact: true });
	await h.wait(1200);
	await h.click(next(), { ms: 900 });
	await h.wait(900);
	await h.click(tid(page, `generate-building-${ALPENBLICK}`), { ms: 900 });
	await h.wait(700);
	await h.click(next(), { ms: 800 });
	await h.wait(1300);
	await h.click(next(), { ms: 800 });
	await page.getByText('Kostenabstimmung').first().waitFor();
	await h.wait(1000);
	await look();
	const confirm = page.getByLabel('Die Abrechnungen trotzdem erstellen');
	if (await confirm.count()) await h.click(confirm, { ms: 900 });
	await h.click(next(), { ms: 900 });
	await h.wait(900);
	await h.click(tid(page, 'generate-statements-button'), { ms: 900 });
	await tid(page, 'generation-result').waitFor();
	await h.wait(1800);
	await h.click(tid(page, 'show-statements-button'), { ms: 800 });
	await page.waitForURL(/\/statements/);
	await h.wait(1500);
	await h.click(page.getByRole('link', { name: /Laura Keller/ }).first(), { ms: 1000 });
	await page.waitForURL(/\/statements\/[0-9a-f-]{36}/);
	await h.wait(1500);
}

const scenes = {
	async gwr(h) {
		const { page } = h;
		await page.goto('/buildings/new');
		await h.moveTo([1000, 300], { ms: 10 });
		await record(h, 'gwr', async () => {
			await h.wait(900);
			await h.scroll(170, 700);
			await h.click(tid(page, 'building-address-search-input'), { ms: 900 });
			await h.type('Seebahnstrasse 155 Zür', 85);
			await tid(page, 'building-address-result-0').waitFor();
			await h.wait(900);
			await h.click(tid(page, 'building-address-result-0'), { ms: 700 });
			await tid(page, 'building-register').waitFor();
			await h.wait(1200);
			await h.moveTo(tid(page, 'building-year-built-input'), { ms: 900 });
			await h.wait(900);
			await h.moveTo([900, 400], { ms: 500 });
			await h.scroll(1500, 3200);
			await h.wait(500);
			await h.scroll(3500, 3000);
			await h.wait(600);
			await h.click(tid(page, 'building-form-submit'), { ms: 900 });
			await page.waitForURL(/\/buildings\/[0-9a-f-]{36}$/);
			await h.wait(1600);
			await h.moveTo([900, 450], { ms: 500 });
			await h.scroll(450, 1400);
			await h.wait(2000);
		});
	},

	async upload(h) {
		const { page } = h;
		await page.goto('/invoices');
		await h.moveTo([900, 400], { ms: 10 });
		const files = readdirSync(INVOICES).filter((f) => f.endsWith('.pdf')).sort();
		await record(h, 'upload-a', async () => {
			await h.wait(800);
			await chooseInvoices(h, files.map((f) => INVOICES + f));
			await h.moveTo([1000, 560], { ms: 900 });
			await h.scroll(400, 1200);
			await h.wait(2600);
		});
		// the KI's reading is not filmed: the cut goes on with what it read
		await notReading(page);
		await record(h, 'upload-b', async () => {
			await h.wait(1200);
			for (const [i, name] of ['Kaminfeger', 'Wasserversorgung', 'Gartenbau'].entries()) {
				const row = await checkRow(h, name, { linger: i === 0 });
				await h.click(row.getByTestId('invoice-upload-row-toggle'), { ms: 800 });
				await h.wait(500);
			}
			await h.click(tid(page, 'invoice-upload-create-button'), { ms: 1000 });
			await tid(page, 'invoice-upload-result').waitFor();
			await h.wait(2800);
		});
	},

	async statements(h) {
		const { page } = h;
		await page.goto('/statements/generate');
		await h.moveTo([900, 400], { ms: 10 });
		await record(h, 'statements', async () => {
			await generateStatements(h, async () => {
				await h.moveTo([900, 400], { ms: 500 });
				await h.scroll(700, 2600);
				await h.wait(1800);
				await h.scroll(700, 2000);
				await h.wait(1500);
			});
			await h.moveTo([900, 400], { ms: 500 });
			await h.scroll(900, 3000);
			await h.wait(1800);
		});
		await savePdf(h, page.url(), 'pdf');
	},

	async reports(h) {
		const { page } = h;
		await page.goto('/reports');
		await h.moveTo([900, 400], { ms: 10 });
		await record(h, 'reports', async () => {
			await h.wait(1200);
			await h.click(page.getByRole('link', { name: /Alpenblick, 01.01.2025/ }), { ms: 1000 });
			await page.waitForURL(/\/reports\//);
			await h.wait(1500);
			await h.moveTo([900, 400], { ms: 500 });
			await h.scroll(500, 2000);
			await h.wait(2000);
		});
		await page.goto('/analytics');
		await record(h, 'analytics', async () => {
			await h.wait(900);
			await h.moveTo(tid(page, 'annual-report-building'), { ms: 800 });
			await tid(page, 'annual-report-building').selectOption({ label: 'Alpenblick' });
			await h.wait(400);
			await h.click(tid(page, 'annual-report-show'), { ms: 800 });
			await h.wait(1500);
			await h.moveTo([900, 400], { ms: 500 });
			await h.scroll(1100, 3000);
			await h.wait(2000);
		});
	},

	// a fresh installation: «Dwello einrichten» with the Einrichtungscode the terminal scene shows
	setup: {
		options: { signedIn: false },
		async run(h) {
			const { page } = h;
			await page.goto('/setup');
			await h.moveTo([900, 300], { ms: 10 });
			await record(h, 'setup', async () => {
				await h.wait(1200);
				await h.click(tid(page, 'setup-code-input'), { ms: 900 });
				await h.type('K7QM-3XRP', 90);
				await h.click(tid(page, 'setup-email-input'), { ms: 700 });
				await h.type('vera@beispiel.ch', 55);
				await h.click(tid(page, 'setup-password-input'), { ms: 600 });
				await h.type('Sicher-Wohnen-2026', 35);
				await h.click(tid(page, 'setup-password-repeat-input'), { ms: 500 });
				await h.type('Sicher-Wohnen-2026', 35);
				await h.wait(600);
				await h.click(tid(page, 'setup-submit'), { ms: 800 });
				await page.waitForURL((url) => !url.pathname.startsWith('/setup'), { timeout: 30000 });
				await h.wait(2500);
			});
		}
	},

	// the vertical cut on a phone: photos of the invoices to the statement, sent by e-mail with its QR-bill. All three
	// invoices, as in the long cut: with the Kaminfeger alone the tenants get money back, and a refund has no QR-bill
	mobile: {
		options: { width: 390, height: 693, out: [1080, 1920], mobile: true },
		async run(h) {
			const { page } = h;
			await page.goto('/invoices');
			await h.moveTo([200, 400], { ms: 10 });
			// the invoices as photos, as the phone's camera takes them
			await record(h, 'm-upload-a', async () => {
				await h.wait(700);
				await chooseInvoices(h, readdirSync(PHOTOS).sort().map((f) => PHOTOS + f));
				await h.wait(1500);
			});
			await notReading(page);
			// not filmed: the other two rows' Verteilschlüssel, so the clip shows one invoice
			for (const name of ['IMG_4822', 'IMG_4823']) {
				const row = await checkRow(h, name, { linger: false });
				await h.click(row.getByTestId('invoice-upload-row-toggle'), { ms: 300 });
			}
			await h.page.getByText('Rechnungen hochladen').first().scrollIntoViewIfNeeded();
			await record(h, 'm-upload-b', async () => {
				await h.wait(800);
				await checkRow(h, 'IMG_4821', { linger: true });
				await h.click(tid(page, 'invoice-upload-create-button'), { ms: 900 });
				await tid(page, 'invoice-upload-result').waitFor();
				await h.wait(2200);
			});
			await page.goto('/statements/generate');
			await record(h, 'm-statements', async () => {
				await generateStatements(h, async () => {
					await h.moveTo([200, 400], { ms: 400 });
					await h.scroll(600, 2200);
					await h.wait(1500);
				});
				await h.moveTo([200, 400], { ms: 400 });
				await h.scroll(500, 1800);
				await h.wait(1200);
			});
			const statement = page.url();
			await savePdf(h, statement, 'pdf-mobile');
			// «Per E-Mail senden»: the persona stack's mail catcher takes the mail
			await page.goto(statement);
			await record(h, 'm-send', async () => {
				await h.wait(900);
				await h.click(tid(page, 'statement-send-button'), { ms: 900 });
				await tid(page, 'send-recipient').waitFor();
				await h.wait(1600);
				await h.click(tid(page, 'statement-send-confirm'), { ms: 900 });
				await tid(page, 'statement-status').filter({ hasText: 'Versendet' }).waitFor({ timeout: 60000 });
				await h.wait(2200);
			});
		}
	}
};

for (const name of process.argv.slice(2)) {
	const scene = typeof scenes[name] === 'function' ? { run: scenes[name] } : scenes[name];
	const h = await launch(scene.options);
	try {
		await scene.run(h);
	} finally {
		await h.browser.close();
	}
}
