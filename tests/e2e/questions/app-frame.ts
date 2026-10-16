import { question } from '../screenplay/actor';
import { Count, ShareInViewport, Text, ThePage, Visibility, Width } from '../screenplay/questions';
import {
	draftNotice,
	footerVersion,
	glossaryExplanation,
	llmRecipient,
	operatorNotice,
	pagePurpose,
	pageSection,
	pageTitle,
	userMenuButton
} from '../targets/app-frame';

export const sectionShown = (heading: string) => Visibility.of(pageSection(heading));
export const sectionText = (heading: string) => Text.of(pageSection(heading));
export const llmRecipientNotice = (heading: string) => Text.of(llmRecipient(heading));
export const draftNoticeText = (heading: string) => Text.of(draftNotice(heading));
export const operatorNoticeText = (heading: string) => Text.of(operatorNotice(heading));
/** Width the page title gets on screen, in pixels */
export const pageTitleWidth = Width.of(pageTitle);
export const pageTitleText = Text.of(pageTitle);
export const pagePurposeText = Text.of(pagePurpose);
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
