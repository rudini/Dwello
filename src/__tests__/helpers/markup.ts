/**
 * Removes what `pattern` matches until nothing is left, so the parts of a removed match cannot form a new one
 * (CodeQL js/incomplete-multi-character-sanitization, #803)
 */
export function strip(html: string, pattern: RegExp): string {
	for (let before = ''; before !== html;) {
		before = html;
		html = html.replace(pattern, '');
	}
	return html;
}

/** The text of rendered markup, without tags */
export const textOf = (html: string) => strip(html, /<[^>]*>/g);

/** Rendered markup without Svelte's comment anchors */
export const withoutComments = (html: string) => strip(html, /<!--[\s\S]*?-->/g);

/** `text` as a regular expression that matches exactly it */
export const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
