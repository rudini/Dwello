// Makes everything around an open modal inert, so a screen reader's browse mode stays inside too;
// only the toasts stay reachable, so one raised meanwhile is still read out and can be closed.
// Returns the function that undoes it.
export function makeInert(modal: HTMLElement) {
	const around: Element[] = [];
	for (let node = modal; node.parentElement && node !== document.body; node = node.parentElement)
		for (const sibling of node.parentElement.children)
			if (sibling !== node && !sibling.matches('[inert], [data-toast-region]'))
				around.push(sibling);
	around.forEach((element) => element.setAttribute('inert', ''));
	return () => around.forEach((element) => element.removeAttribute('inert'));
}
