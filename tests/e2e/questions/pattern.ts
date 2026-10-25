/** `text` as a regular expression that matches exactly it, dots, slashes and backslashes included (#803) */
export const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
