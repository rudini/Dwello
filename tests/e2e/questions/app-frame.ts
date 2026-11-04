import { question } from '../screenplay/actor';
import { Attribute, Count, Gap, ShareInViewport, Text, ThePage, Visibility, Width } from '../screenplay/questions';
import {
	draftNotice,
	focusedPart,
	footerVersion,
	glossaryExplanation,
	legalAsOf,
	llmRecipient,
	newestSuccessToast,
	operatorNotice,
	pagePurpose,
	pageSection,
	sectionLinks,
	pageTitle,
	userMenuButton
} from '../targets/app-frame';
import { successToast } from '../targets/form';

export const sectionShown = (heading: string) => Visibility.of(pageSection(heading));
export const sectionText = (heading: string) => Text.of(pageSection(heading));
export const sectionLinkAddresses = (heading: string) => Attribute.named('href').ofAll(sectionLinks(heading));
export const llmRecipientNotice = (heading: string) => Text.of(llmRecipient(heading));
export const draftNoticeText = (heading: string) => Text.of(draftNotice(heading));
export const operatorNoticeText = (heading: string) => Text.of(operatorNotice(heading));
/** Width the page title gets on screen, in pixels */
export const pageTitleWidth = Width.of(pageTitle);
export const pageTitleText = Text.of(pageTitle);
export const pagePurposeText = Text.of(pagePurpose);
export const legalAsOfText = Text.of(legalAsOf);
export const pageOverflowsSideways = question(
	'whether the page scrolls sideways',
	async (actor) => (await actor.answer(ThePage.sidewaysOverflow)) > 0
);
export const userMenuCount = Count.of(userMenuButton);
export const tabIcon = ThePage.tabIcon;
export const footerVersionText = Text.of(footerVersion);
export const glossaryExplanationText = (term: string) => Text.of(glossaryExplanation(term));
/** The anchor of the page address, e.g. «#glossary», or '' without one */
export const pageAnchor = question('the anchor of the page address', async (actor) => new URL(await actor.answer(ThePage.url)).hash);
export const sectionShareInWindow = (heading: string) => ShareInViewport.of(pageSection(heading));

/** #1081, #1096: the room between what has the focus and the confirmation, on whichever side it stands (negative: it covers it) */
export const roomAroundConfirmation = question('the room between the focus and the confirmation', async (actor) => {
	const sides = await Promise.all(
		[
			Gap.between(focusedPart, newestSuccessToast),
			Gap.between(newestSuccessToast, focusedPart),
			Gap.beside(focusedPart, newestSuccessToast),
			Gap.beside(newestSuccessToast, focusedPart)
		].map((gap) => actor.answer(gap))
	);
	return sides.includes(null) ? null : Math.max(...(sides as number[]));
});
/** #1096: how far the page moved until the confirmation left by itself */
export const pageMovedUntilConfirmationLeft = ThePage.movedUntilGone(newestSuccessToast);
/** #1096: every confirmation the page shows, oldest first */
export const shownConfirmations = Text.ofAll(successToast);
/** #1096: what the part with the focus says, e.g. the name of a row's link */
export const focusedText = Text.of(focusedPart);
