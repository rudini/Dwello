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
	/** The values of all fields the target finds, in page order */
	ofAll: (target: Target) =>
		about(target, 'the values of', (element) => element.evaluateAll((all) => all.map((field) => (field as HTMLInputElement).value))),
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
/** How many pixels the widest part of a box (itself or anything in it) hides sideways; 0 when everything fits. An `sr-only`
 * part counts too: put a spoken-only text in a `hidden` element named by `aria-describedby` */
export const HiddenSideways = {
	within: (target: Target) =>
		about(target, 'what is hidden sideways in', (element) =>
			single(element, (one) =>
				one.evaluate(
					(box) => Math.max(...[box, ...box.querySelectorAll('*')].map((part) => part.scrollWidth - part.clientWidth)),
					undefined,
					quick
				)
			)
		)
};
/** How many pixels the farthest part of a box reaches beyond the box's sides, or the box beyond the window's; 0 when
 *  everything shows within. Measured by bounding rectangles, so it reads alike in every browser (#1071) */
export const ReachingOut = {
	of: (target: Target) =>
		about(target, 'how far a part reaches out of', (element) =>
			single(element, (one) =>
				one.evaluate(
					(box) => {
						const outer = box.getBoundingClientRect();
						const overhang = (inner: DOMRect, { left, right }: { left: number; right: number }) =>
							inner.width ? Math.max(0, left - inner.left, inner.right - right) : 0;
						// the text lines too: a text runs on beyond the element that holds it (code review 1071 C-1)
						const lines = document.createRange();
						lines.selectNodeContents(box);
						const parts = [...[...box.querySelectorAll('*')].map((part) => part.getBoundingClientRect()), ...lines.getClientRects()].map(
							(part) => overhang(part, outer)
						);
						const window = { left: 0, right: document.documentElement.clientWidth };
						return Math.round(Math.max(overhang(outer, window), ...parts));
					},
					undefined,
					quick
				)
			)
		)
};
/** The data-testid of the element that has the focus, null without one */
export const FocusedElement = question('the focused element', (actor) =>
	pageOf(actor).evaluate(() => document.activeElement?.getAttribute('data-testid') ?? null)
);
/** The label of the field that has the focus, whitespace normalized like Text.of (#653) */
export const FocusedLabel = question('the label of the focused field', (actor) =>
	pageOf(actor).evaluate(() => {
		const labels = (document.activeElement as HTMLInputElement | null)?.labels;
		return labels?.length ? [...labels].map((label) => label.textContent).join(' ').replace(/\s+/g, ' ').trim() : null;
	})
);
/** The text of the element that has the focus, whitespace normalized like Text.of */
export const FocusedText = question('the text of the focused element', (actor) =>
	pageOf(actor).evaluate(() => document.activeElement?.textContent?.replace(/\s+/g, ' ').trim() ?? null)
);
/** Whether the focus lies inside the element, e.g. a dialog after a control in it removed itself */
export const HoldsFocus = {
	of: (target: Target) =>
		about(target, 'whether it holds the focus:', (element) =>
			single(element, (one) => one.evaluate((part) => part.contains(document.activeElement), undefined, quick))
		)
};
/** The tones (Alert, Badge: data-tone) shown in the element and everything in it, e.g. [] for a plain note (#687) */
export const Tones = {
	in: (target: Target) =>
		about(target, 'the tones shown in', (element) =>
			single(element, (one) =>
				one.evaluate(
					(box) => [box, ...box.querySelectorAll('*')].flatMap((part) => part.getAttribute('data-tone') ?? []),
					undefined,
					quick
				)
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
			about(target, `the attribute ${name} of`, (element) => single(element, (one) => one.getAttribute(name, quick))),
		ofAll: (target: Target) =>
			about(target, `the attributes ${name} of`, (element) =>
				element.evaluateAll((all, attribute) => all.map((one) => one.getAttribute(attribute)), name)
			)
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
	/** Of buttons and links: their aria-label, else their text */
	namesOfAll: (target: Target) =>
		about(target, 'the accessible names of', async (element) =>
			(await element.evaluateAll((all) => all.map((one) => one.getAttribute('aria-label') ?? one.textContent ?? ''))).map(
				normalized
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

/**
 * How the values of a list of terms (`dd`) line up: how far their right edges differ, and how many lines the longest
 * one takes (#1089)
 */
export const ValueColumn = {
	of: (target: Target) =>
		about(target, 'how the values line up in', (element) =>
			single(element, (one) =>
				one.evaluate((list) => {
					const values = [...list.querySelectorAll('dd')];
					const rights = values.map((value) => Math.round(value.getBoundingClientRect().right));
					const lines = values.map((value) => {
						const text = document.createRange();
						text.selectNodeContents(value);
						return new Set([...text.getClientRects()].map((line) => Math.round(line.top))).size;
					});
					return { offset: Math.max(...rights) - Math.min(...rights), lines: Math.max(...lines) };
				}, undefined, quick)
			)
		)
};

/** The words of the targets' texts that run over two lines, broken inside the word (#667, Dr. Weber W-10) */
export const BrokenWords = {
	in: (target: Target) =>
		about(target, 'the words broken across lines in', (element) =>
			element.evaluateAll((all) =>
				all.flatMap((one) => {
					const texts = document.createTreeWalker(one, NodeFilter.SHOW_TEXT);
					const broken: string[] = [];
					for (let text = texts.nextNode(); text; text = texts.nextNode())
						for (const word of (text.textContent ?? '').matchAll(/\S+/g)) {
							const range = document.createRange();
							range.setStart(text, word.index);
							range.setEnd(text, word.index + word[0].length);
							if (new Set([...range.getClientRects()].map((line) => Math.round(line.top))).size > 1) broken.push(word[0]);
						}
					return broken;
				})
			)
		)
};

/** The texts the target shows on screen, one entry per line from top to bottom (texts on one line joined by a space);
 *  a text hidden for screen readers only (sr-only, one pixel wide) does not count (#1179) */
export const ShownLines = {
	of: (target: Target) =>
		about(target, 'the lines shown of', (element) =>
			element.evaluateAll((all) => {
				const lines = new Map<number, string[]>();
				for (const one of all) {
					const box = one.getBoundingClientRect();
					if (box.width <= 1) continue;
					const top = Math.round(box.top);
					lines.set(top, [...(lines.get(top) ?? []), (one.textContent ?? '').trim().replace(/\s+/g, ' ')]);
				}
				return [...lines].sort(([a], [b]) => a - b).map(([, texts]) => texts.join(' '));
			})
		)
};

/** How many pixels of the chosen option's text a select cuts off: a select clips its text instead of wrapping (#1089) */
export const CutInChoice = {
	of: (target: Target) =>
		about(target, 'how much of the chosen text is cut in', (element) =>
			single(element, (one) =>
				one.evaluate((select: HTMLSelectElement) => {
					const style = getComputedStyle(select);
					const pen = document.createElement('canvas').getContext('2d')!;
					// from its parts: Firefox may answer the shorthand empty, and the canvas would measure 10px sans-serif (code review 1089 C-2)
					pen.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
					const room = select.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
					const text = select.selectedOptions[0]?.text ?? '';
					return Math.max(0, Math.ceil(pen.measureText(text).width - room));
				}, undefined, quick)
			)
		)
};

/** What the eye sees of an element's colours, with its opacity and that of its ancestors over the page behind (#1182) */
export const Colour = {
	/** The contrast of its text against its background, as WCAG computes it, rounded to two decimals */
	contrastOf: (target: Target) =>
		about(target, 'the text contrast of', (element) =>
			single(element, (one) =>
				one.evaluate((shown) => {
					const parts = (colour: string) => (colour.match(/[\d.]+/g) ?? []).map(Number);
					const mix = (top: number[], alpha: number, base: number[]) => base.map((v, i) => top[i] * alpha + v * (1 - alpha));
					let behind = [255, 255, 255];
					for (let parent = shown.parentElement; parent; parent = parent.parentElement) {
						const [r, g, b, a = 1] = parts(getComputedStyle(parent).backgroundColor);
						if (a === 1) {
							behind = [r, g, b];
							break;
						}
					}
					let opacity = 1;
					for (let node: Element | null = shown; node; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
					const style = getComputedStyle(shown);
					const [br, bg, bb, ba = 1] = parts(style.backgroundColor);
					const [tr, tg, tb, ta = 1] = parts(style.color);
					const ownBackground = mix([br, bg, bb], ba, behind);
					const background = mix(ownBackground, opacity, behind);
					const text = mix(mix([tr, tg, tb], ta, ownBackground), opacity, behind);
					const luminance = (rgb: number[]) => {
						const [r, g, b] = rgb.map((v) => (v / 255 <= 0.03928 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4));
						return 0.2126 * r + 0.7152 * g + 0.0722 * b;
					};
					const [hi, lo] = [luminance(text), luminance(background)].sort((x, y) => y - x);
					return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
				}, undefined, quick)
			)
		),
	/** The colour token its background shows (one of `tokens`), else the colour as the browser computes it */
	backgroundOf: (target: Target, tokens: string[]) =>
		about(target, 'the background colour token of', (element) =>
			single(element, (one) =>
				one.evaluate(
					(shown, names) => {
						const colour = getComputedStyle(shown).backgroundColor;
						const hex = `#${(colour.match(/\d+/g) ?? []).slice(0, 3).map((part) => Number(part).toString(16).padStart(2, '0')).join('')}`;
						const root = getComputedStyle(document.documentElement);
						const token = names.find((name) => root.getPropertyValue(`--color-${name}`).trim().toLowerCase() === hex);
						return token ?? colour;
					},
					tokens,
					quick
				)
			)
		)
};

export const Width = {
	of: (target: Target) =>
		about(target, 'the width of', (element) => single(element, async (one) => (await one.boundingBox(quick))?.width ?? 0))
};

/** Whether the element is what the window shows at its centre, not covered by another (#669) */
export const OnTop = {
	of: (target: Target) =>
		about(target, 'whether on top:', (element) =>
			single(element, (one) =>
				one.evaluate(
					(node) => {
						const box = node.getBoundingClientRect();
						return node.contains(document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2));
					},
					undefined,
					quick
				)
			)
		)
};

/** The space in pixels from the bottom of one target down to the top of another, null when either is missing */
export const Gap = {
	between: (upper: Target, lower: Target) =>
		question(`the gap between ${upper} and ${lower}`, async (actor) => {
			const page = pageOf(actor);
			const [top, bottom] = await Promise.all([upper, lower].map((one) => one.locate(page).boundingBox(quick).catch(() => null)));
			return top && bottom ? Math.round(bottom.y - (top.y + top.height)) : null;
		}),
	/** the room between the right edge of `left` and the left edge of `right` (#1096) */
	beside: (left: Target, right: Target) =>
		question(`the gap between ${left} and ${right} beside it`, async (actor) => {
			const page = pageOf(actor);
			const [one, other] = await Promise.all([left, right].map((part) => part.locate(page).boundingBox(quick).catch(() => null)));
			return one && other ? Math.round(other.x - (one.x + one.width)) : null;
		})
};

export const ThePage = {
	/** How far the page moved since `Scroll.watch`, in pixels, once the target is gone (null while it shows; #1096) */
	movedUntilGone: (gone: Target) =>
		question(`how far the page moved until ${gone} left`, async (actor) => {
			const page = pageOf(actor);
			if (await gone.locate(page).count()) return null;
			return page.evaluate(() => (window as { dwelloMoved?: number }).dwelloMoved ?? null);
		}),
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
	/** How much taller the page is than the window: more than 0 means it scrolls (#657) */
	downwardOverflow: question('how far the page scrolls down', (actor) =>
		pageOf(actor).evaluate(() => document.documentElement.scrollHeight - document.documentElement.clientHeight)
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
	/** The selects on the page whose chosen text is cut off, as «chosen text» lines; [] when every choice shows whole (#658) */
	cutChoices: question('choices cut off on the page', (actor) =>
		pageOf(actor).evaluate(() => {
			const pen = document.createElement('canvas').getContext('2d')!;
			return [...document.querySelectorAll('select')].flatMap((select) => {
				const style = getComputedStyle(select);
				if (!select.offsetParent) return [];
				pen.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
				const room = select.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
				const text = select.selectedOptions[0]?.text ?? '';
				const cut = Math.ceil(pen.measureText(text).width - room);
				return cut > 0 ? [`«${text}» cut by ${cut} px`] : [];
			});
		})
	),
	/** Rule violations axe finds on the page as it is now, as readable lines; [] when none */
	accessibilityViolations: (tags: string[]) =>
		question('the accessibility violations on the page', async (actor) => {
			const page = pageOf(actor);
			// From the top of the page: a scrolled page slides content under the sticky header, and target-size would
			// then judge a 48 px link by the part the header leaves visible. First the page settles: after a refused save
			// `focusFirstError` (src/lib/ui/focus-error.ts) focuses the field in a timeout, and that focus scrolls the page
			// again; a scroll to the top before it left a date field's calendar button under the header (PR #514)
			await page.evaluate(
				() => new Promise((resolve) => setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(resolve))))
			);
			await page.evaluate(() => window.scrollTo(0, 0));
			const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
			return violations.flatMap((violation) =>
				violation.nodes.map((node) => `${violation.id}: ${violation.help} – ${node.target.join(' ')}`)
			);
		})
};

/** The page a link opened (`OpenInNewTab`): whether in a new tab, and the path it leads to */
export const OpenedPage = question('the page opened by a link', async (actor) => {
	const { newTab, url } = actor.recall<{ newTab: boolean; url: string }>(OPENED);
	return { newTab, path: new URL(url).pathname };
});
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

/** The mails to the address, as the mail catcher the backend sends to in E2E runs received them (playwright.config.ts) */
export const MailsTo = (address: string) =>
	question(`the mails to ${address}`, async () =>
		((await (await fetch('http://localhost:2526/messages')).json()) as { to: string; subject: string; attachments: string[] }[]).filter(
			(mail) => mail.to === address
		)
	);

/** What a screen reader announced since `ListenToAnnouncements`, in order (#1173) */
export const Announcements = question('what a screen reader announced', (actor) =>
	pageOf(actor).evaluate(() => (window as unknown as { announced?: string[] }).announced ?? [])
);
