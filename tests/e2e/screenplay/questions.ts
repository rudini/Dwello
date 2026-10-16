import AxeBuilder from '@axe-core/playwright';
import type { Download, Locator } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { type Actor, type Question, question } from './actor';
import { BrowseTheWeb } from './abilities';
import { DOWNLOAD, OPENED } from './interactions';
import type { Target } from './target';

// Web questions: what the page shows, as values. They never wait for the page (`actor.sees` asks again until the
// expectation holds); a target that is not there answers null, false or 0.

const pageOf = (actor: Actor) => actor.abilityTo(BrowseTheWeb).page;
const about = <T>(target: Target, description: string, answer: (element: Locator) => Promise<T>) =>
	question(`${description} ${target}`, (actor) => answer(target.locate(pageOf(actor))));

// Whitespace as Playwright's toHaveText normalizes it
const normalized = (text: string) => text.replace(/\u200b/g, '').trim().replace(/\s+/g, ' ');

// Counted just before: an element that vanishes in between fails within a second instead of waiting; `actor.sees`
// asks again, a task asking directly gets the error
const quick = { timeout: 1000 };

/** The one element the target finds, as toHaveText expects it: none answers null, several fail */
async function single<T>(element: Locator, answer: (element: Locator) => Promise<T>): Promise<T | null> {
	const count = await element.count();
	if (count > 1) throw new Error(`strict mode: ${count} elements found`);
	return count ? answer(element) : null;
}

const textsOf = async (element: Locator) =>
	(await element.evaluateAll((all) => all.map((one) => one.textContent ?? ''))).map(normalized);

export const Text = {
	of: (target: Target) =>
		about(target, 'the text of', (element) => single(element, async (one) => (await textsOf(one))[0])),
	ofAll: (target: Target) => about(target, 'the texts of', textsOf)
};

export const Value = {
	of: (target: Target) =>
		about(target, 'the value of', (element) =>
			single(element, async (one) => one.evaluate((field) => (field as HTMLInputElement).value, undefined, quick))
		),
	/** The label of the chosen option of a select */
	chosenIn: (target: Target) =>
		about(target, 'the chosen option of', (element) =>
			single(element, (one) =>
				one.evaluate((select: HTMLSelectElement) => select.selectedOptions[0]?.text.trim() ?? '', undefined, quick)
			)
		)
};

/** How many pixels of a field's text its box hides (scrolled away inside it); 0 when the whole text shows */
export const HiddenText = {
	of: (target: Target) =>
		about(target, 'the hidden part of', (element) =>
			single(element, (one) =>
				one.evaluate((field) => Math.max(field.scrollHeight - field.clientHeight, field.scrollWidth - field.clientWidth), undefined, quick)
			)
		)
};
export const Visibility = { of: (target: Target) => about(target, 'whether shown:', (element) => element.isVisible()) };
export const Count = { of: (target: Target) => about(target, 'how many of', (element) => element.count()) };
export const Enabled = {
	of: (target: Target) => about(target, 'whether enabled:', (element) => single(element, (one) => one.isEnabled(quick)))
};
export const Checked = {
	of: (target: Target) => about(target, 'whether checked:', (element) => single(element, (one) => one.isChecked(quick)))
};

export const Attribute = {
	named: (name: string) => ({
		of: (target: Target) =>
			about(target, `the attribute ${name} of`, (element) => single(element, (one) => one.getAttribute(name, quick)))
	})
};

/** The accessible name and description as a screen reader announces them (labelling elements resolved) */
export const Accessible = {
	nameOf: (target: Target) =>
		about(target, 'the accessible name of', (element) =>
			single(element, async (one) =>
				normalized(
					await one.evaluate((field) => {
						const byIds = (ids: string | null) =>
							(ids ?? '').split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' ');
						if (field.getAttribute('aria-labelledby')) return byIds(field.getAttribute('aria-labelledby'));
						if (field.getAttribute('aria-label')) return field.getAttribute('aria-label')!;
						const legend = field.querySelector(':scope > legend');
						const labels = (field as HTMLInputElement).labels;
						return legend?.textContent ?? [...(labels ?? [])].map((label) => label.textContent).join(' ');
					}, undefined, quick)
				)
			)
		),
	descriptionOf: (target: Target) =>
		about(target, 'the accessible description of', (element) =>
			single(element, async (one) =>
				normalized(
					await one.evaluate((field) => {
						const ids = (field.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
						const described = ids.map((id) => document.getElementById(id)?.textContent ?? '').join(' ');
						return described || field.getAttribute('aria-description') || '';
					}, undefined, quick)
				)
			)
		)
};

/** Share of the element inside the window, 0 to 1, as toBeInViewport measures it */
export const ShareInViewport = {
	of: (target: Target) =>
		about(target, 'the share in the window of', (element) =>
			single(element, (one) =>
				one.evaluate(
					(node) =>
						new Promise<number>((resolve) => {
							const observer = new IntersectionObserver(([entry]) => {
								observer.disconnect();
								resolve(entry.intersectionRatio);
							});
							observer.observe(node);
						}),
					undefined,
					quick
				)
			)
		)
};

export const Width = {
	of: (target: Target) =>
		about(target, 'the width of', (element) => single(element, async (one) => (await one.boundingBox(quick))?.width ?? 0))
};

export const ThePage = {
	url: question('the address of the page', (actor) => pageOf(actor).url()),
	title: question('the title of the page', (actor) => pageOf(actor).title()),
	/** The type of the icon the page names for its browser tab, or the status when it does not load */
	tabIcon: question('the icon of the browser tab', async (actor) => {
		const page = pageOf(actor);
		const href = await page.locator('link[rel="icon"]').getAttribute('href', quick);
		const response = await page.request.get(new URL(href!, page.url()).href);
		return response.ok() ? response.headers()['content-type'] : `HTTP ${response.status()}`;
	}),
	/** How much wider the page is than the window: more than 0 means it scrolls sideways */
	sidewaysOverflow: question('how far the page scrolls sideways', (actor) =>
		pageOf(actor).evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
	),
	/** Everything the page says to a reader: text, also hidden for screen readers, and labelling attributes */
	texts: question('the texts of the page', (actor) =>
		pageOf(actor).evaluate(() => {
			const found: string[] = [document.title];
			const skip = (node: Node) => node.parentElement?.closest('script, style, noscript, #language-menu');
			const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
			for (let node = walker.nextNode(); node; node = walker.nextNode())
				if (!skip(node) && node.textContent?.trim()) found.push(node.textContent.trim());
			for (const element of document.body.querySelectorAll('[aria-label], [title], [placeholder], [alt]'))
				for (const name of ['aria-label', 'title', 'placeholder', 'alt'])
					if (element.getAttribute(name)) found.push(element.getAttribute(name)!);
			for (const input of document.body.querySelectorAll<HTMLInputElement>('input[type=submit], input[type=button]'))
				found.push(input.value);
			return found;
		})
	),
	/** Sideways scrolling of the page, or text cut off by its box; [] when everything fits */
	cutOffText: question('text cut off on the page', (actor) =>
		pageOf(actor).evaluate(() => {
			const found: string[] = [];
			const root = document.documentElement;
			if (root.scrollWidth > root.clientWidth + 1) found.push(`page ${root.scrollWidth} px wide in ${root.clientWidth} px`);
			for (const element of document.body.querySelectorAll<HTMLElement>('*')) {
				const style = getComputedStyle(element);
				const clips = ['hidden', 'clip'].includes(style.overflowX) && style.textOverflow !== 'ellipsis';
				const ownText = [...element.childNodes].some((node) => node.nodeType === 3 && node.textContent!.trim());
				// sr-only boxes and SvelteKit's route announcer are 1 px on purpose; tables and lists scroll inside their own region (Table.svelte)
				if (!clips || !ownText || element.closest('.sr-only, [role="region"], #svelte-announcer')) continue;
				if (element.scrollWidth > element.clientWidth + 1)
					found.push(`«${element.textContent!.trim().slice(0, 60)}» cut off (${element.scrollWidth} > ${element.clientWidth} px)`);
			}
			return found;
		})
	),
	/** Rule violations axe finds on the page as it is now, as readable lines; [] when none */
	accessibilityViolations: (tags: string[]) =>
		question('the accessibility violations on the page', async (actor) => {
			const page = pageOf(actor);
			// From the top of the page: a scrolled page slides content under the sticky header, and target-size would
			// then judge a 48 px link by the part the header leaves visible
			await page.evaluate(() => window.scrollTo(0, 0));
			const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
			return violations.flatMap((violation) =>
				violation.nodes.map((node) => `${violation.id}: ${violation.help} – ${node.target.join(' ')}`)
			);
		})
};

/** The file the actor opened in a new tab last (`OpenInNewTab`): whether it was shown there, its name and bytes */
export const OpenedFile = question('the file opened in a new tab', async (actor) => {
	const { newTab, disposition, content } = actor.recall<{ newTab: boolean; disposition: string; content: Buffer }>(OPENED);
	const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/)?.[1];
	const name = encoded ? decodeURIComponent(encoded) : (disposition.match(/filename="([^"]*)"/)?.[1] ?? '');
	return { shown: newTab && disposition.startsWith('inline'), name, content };
});

/** The file downloaded last (`DownloadFrom`): its name and content */
export const DownloadedFile: Question<{ name: string; content: Buffer }> = question('the downloaded file', async (actor) => {
	const download = actor.recall<Download>(DOWNLOAD);
	return { name: download.suggestedFilename(), content: await readFile(await download.path()) };
});

/** The address of the request noticed under the key (`NoticeRequest`); null while none was sent */
export const RequestedUrl = (key: string) =>
	question(`the address of the request ${key}`, (actor) => {
		const url = actor.recall<string | undefined>(key);
		return url ? new URL(url) : null;
	});
