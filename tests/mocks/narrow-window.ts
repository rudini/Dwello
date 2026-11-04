// jsdom has no matchMedia: the DOM tests' window is narrow, no media query matches
window.matchMedia = (query: string) =>
	({
		matches: false,
		media: query,
		addEventListener() {},
		removeEventListener() {}
	}) as unknown as MediaQueryList;
