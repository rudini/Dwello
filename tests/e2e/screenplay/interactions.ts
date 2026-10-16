import { expect, type BrowserContext, type Locator, type Page } from '@playwright/test';
import type { Activity, Actor } from './actor';
import { BrowseTheWeb } from './abilities';
import type { Target } from './target';

// The Playwright layer under the tasks: the only place, with targets/, that drives the page

const pageOf = (actor: Actor) => actor.abilityTo(BrowseTheWeb).page;
const locate = (actor: Actor, target: Target) => target.locate(pageOf(actor));
const on = (target: Target, act: (element: Locator) => Promise<unknown>): Activity => (actor) => act(locate(actor, target));

// SSR pages only react to input once hydrated; hydration resets fields changed before it (seen on WebKit in CI)
const hydrated = (page: Page) => page.locator('body[data-hydrated]').waitFor({ state: 'attached' });
const SCRIPTS_HELD_BACK = 'scripts held back';

export const Navigate = {
	to: (path: string): Activity => async (actor) => {
		await pageOf(actor).goto(path);
		await hydrated(pageOf(actor));
	},
	reload: (async (actor) => {
		await pageOf(actor).reload();
		await hydrated(pageOf(actor));
	}) as Activity,
	// The page's client JS held back, so it stays server-rendered (not hydrated) until `releaseScripts`: what a user
	// sees on a slow connection
	toWithScriptsHeldBack: (path: string): Activity => async (actor) => {
		let release!: () => void;
		const released = new Promise<void>((resolve) => (release = resolve));
		await pageOf(actor).route('**/*', async (route) => {
			if (route.request().resourceType() === 'script') await released;
			await route.continue();
		});
		actor.remember(SCRIPTS_HELD_BACK, release);
		await pageOf(actor).goto(path, { waitUntil: 'commit' });
	},
	releaseScripts: (async (actor) => {
		actor.recall<() => void>(SCRIPTS_HELD_BACK)();
		await hydrated(pageOf(actor));
	}) as Activity
};

export const Click = {
	on: (target: Target) => on(target, (element) => element.click()),
	// A click that loads the page anew (e.g. the language selection); waits until it is hydrated again
	toReload: (target: Target): Activity => async (actor) => {
		await Promise.all([pageOf(actor).waitForEvent('load'), locate(actor, target).click()]);
		await hydrated(pageOf(actor));
	}
};

export const Enter = {
	theValue: (value: string) => ({
		into: (target: Target) => on(target, (element) => element.fill(value)),
		intoEach: (target: Target) =>
			on(target, async (elements) => {
				for (const element of await elements.all()) await element.fill(value);
			})
	}),
	/** Empties the field and types key by key, as a user does: for fields that react to each key */
	keyByKey: (text: string) => {
		const type = (leave: boolean) => (target: Target) =>
			on(target, async (field) => {
				await field.fill('');
				await field.pressSequentially(text);
				if (leave) await field.blur();
			});
		return { into: type(false), intoAndLeave: type(true) };
	}
};

/** Types a date the Swiss way (TT.MM.JJJJ) into a date field; scenarios keep JJJJ-MM-TT, or '' to empty the field */
export const EnterDate = {
	of: (isoDate: string) => ({
		into: (target: Target) =>
			on(target, async (field) => {
				const [year, month, day] = isoDate.split('-');
				const text = isoDate ? `${day}.${month}.${year}` : '';
				await field.fill('');
				await field.pressSequentially(text, { delay: 20 }); // key by key, as a user types it
				await expect(field).toHaveValue(text); // every key arrived, before the field is left
				await field.blur();
			})
	})
};

type Option = Parameters<Locator['selectOption']>[0];
export const Select = {
	option: (option: Option) => ({ from: (target: Target) => on(target, (element) => element.selectOption(option)) })
};

export const Scroll = { to: (target: Target) => on(target, (element) => element.scrollIntoViewIfNeeded()) };
export const Check = { the: (target: Target) => on(target, (element) => element.check()) };
export const Uncheck = { the: (target: Target) => on(target, (element) => element.uncheck()) };
export const Press = {
	theKey: (key: string) => ({ on: (target: Target) => on(target, (element) => element.press(key)) })
};
export const Upload = {
	theFile: (file: Parameters<Locator['setInputFiles']>[0]) => ({
		into: (target: Target) => on(target, (element) => element.setInputFiles(file))
	})
};

export const Wait = {
	/** until the target is shown: a state reached before the next step looks */
	until: (target: Target) => on(target, (element) => element.first().waitFor()),
	/** until a field shows the value, e.g. a suggestion that arrives after the page */
	forValue: (target: Target, value: string) => on(target, (element) => expect(element).toHaveValue(value)),
	/** until the target finds exactly that many elements */
	forCount: (target: Target, count: number) => on(target, (elements) => expect(elements).toHaveCount(count)),
	forUrl: (matches: (url: URL) => boolean): Activity => (actor) => pageOf(actor).waitForURL(matches)
};

/** Clicks a link that downloads a file and keeps the download for `DownloadedFile` */
export const DownloadFrom = (target: Target): Activity => async (actor) => {
	const download = pageOf(actor).waitForEvent('download');
	await locate(actor, target).click();
	actor.remember(DOWNLOAD, await download);
};
export const DOWNLOAD = 'download';

/**
 * Follows a link that shows a file in a new tab, as that tab would load it (the page's cookies), and keeps the file for
 * `OpenedFile`; headless Chromium shows no PDF in a tab, so the link is followed by a request instead of a click. A file
 * the page holds itself (a `blob:` address, e.g. one chosen for upload) is read in the page, with the type it is shown as
 */
export const OpenInNewTab = (target: Target): Activity => async (actor) => {
	const page = pageOf(actor);
	const link = locate(actor, target);
	const newTab = (await link.getAttribute('target')) === '_blank';
	const href = (await link.getAttribute('href'))!;
	if (href.startsWith('blob:')) {
		const { type, bytes } = await page.evaluate(async (url) => {
			const blob = await (await fetch(url)).blob();
			return { type: blob.type, bytes: [...new Uint8Array(await blob.arrayBuffer())] };
		}, href);
		return actor.remember(OPENED, { newTab, disposition: `inline; type=${type}`, content: Buffer.from(bytes) });
	}
	const response = await page.context().request.get(new URL(href, page.url()).toString());
	actor.remember(OPENED, { newTab, disposition: response.headers()['content-disposition'] ?? '', content: await response.body() });
};
export const OPENED = 'opened';

/** Notices the next request the browser sends to a matching URL, for `RequestedUrl` under the same key */
export const NoticeRequest = (url: RegExp, key: string): Activity => async (actor) => {
	void pageOf(actor)
		.waitForRequest(url)
		.then((request) => actor.remember(key, request.url()))
		.catch(() => {}); // no such request: `RequestedUrl` answers null
};

/**
 * Answers the browser's requests to `path` with these query values with an error status: only to reach a state a
 * failing request produces, never with invented data (docs/test-pyramid.md). Set before the page that sends them.
 */
export const FailRequests = {
	to: (path: string, query: Record<string, string>): Activity => (actor) =>
		pageOf(actor).route(
			(url) => url.pathname === path && Object.entries(query).every(([key, value]) => url.searchParams.get(key) === value),
			(route) => route.fulfill({ status: 500 })
		),
	/** The requests answer again as the system does */
	noLonger: (async (actor) => pageOf(actor).unrouteAll()) as Activity
};

export const Cookies = {
	add: (cookies: Parameters<BrowserContext['addCookies']>[0]): Activity => (actor) =>
		pageOf(actor).context().addCookies(cookies),
	clear: (async (actor) => pageOf(actor).context().clearCookies()) as Activity
};

export const Browser = {
	// What the server reads (Accept-Language) and what the page's own scripts read (navigator.languages)
	preferLanguages: (acceptLanguage: string): Activity => async (actor) => {
		const languages = acceptLanguage.split(',').map((language) => language.split(';')[0]);
		await pageOf(actor).setExtraHTTPHeaders({ 'Accept-Language': acceptLanguage });
		await pageOf(actor).addInitScript((list) => Object.defineProperty(navigator, 'languages', { get: () => list }), languages);
	},
	resizeTo: (size: { width: number; height: number }): Activity => (actor) => pageOf(actor).setViewportSize(size),
	useColorScheme: (colorScheme: 'light' | 'dark'): Activity => (actor) =>
		pageOf(actor).emulateMedia({ colorScheme, reducedMotion: 'reduce' }),
	// No draft from an earlier visit; nothing to clear before the first page
	clearLocalStorage: (async (actor) => pageOf(actor).evaluate(() => localStorage.clear()).catch(() => {})) as Activity,
	// What an earlier visit left in the browser, e.g. a wizard draft naming records deleted since
	keepInLocalStorage: (entries: Record<string, string>): Activity => (actor) =>
		pageOf(actor).evaluate((kept) => Object.entries(kept).forEach(([k, v]) => localStorage.setItem(k, v)), entries)
};

/** Posts a form action of the page without its UI, as from a tab that still shows an older state */
export const PostFormAction = (action: string, fields: Record<string, string> = {}): Activity => (actor) =>
	pageOf(actor).evaluate(
		({ action, fields }) => {
			const form = Object.assign(document.createElement('form'), { method: 'POST', action });
			for (const [name, value] of Object.entries(fields))
				form.append(Object.assign(document.createElement('input'), { type: 'hidden', name, value }));
			document.body.append(form);
			form.submit();
		},
		{ action, fields }
	);
