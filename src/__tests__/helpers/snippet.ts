import { createRawSnippet } from 'svelte';

/** Snippet rendering fixed markup, for passing children to a component in a test */
export const markup = (html: string) => createRawSnippet(() => ({ render: () => html }));
