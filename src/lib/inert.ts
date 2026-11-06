// Makes everything around an open modal inert, so a screen reader's browse mode stays inside too;
// only the toasts stay reachable, so one raised meanwhile is still read out and can be closed.
// Returns the function that undoes it.
export function makeInert(modal: HTMLElement) {
	const around: Element[] = [];
	// a part that holds the toasts (the page frame, #669) goes inert part by part around them
	const cover = (element: Element) => {
		if (element.matches('[inert], [data-toast-region]')) return;
		if (!element.querySelector('[data-toast-region]')) return void around.push(element);
		for (const child of element.children) cover(child);
	};
	for (let node = modal; node.parentElement && node !== document.body; node = node.parentElement)
		for (const sibling of node.parentElement.children) if (sibling !== node) cover(sibling);
	around.forEach((element) => element.setAttribute('inert', ''));
	return () => around.forEach((element) => element.removeAttribute('inert'));
}
