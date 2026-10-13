import { question } from '../screenplay/actor';
import { Count, Text, ThePage, Visibility, Width } from '../screenplay/questions';
import { draftNotice, llmRecipient, operatorNotice, pageSection, pageTitle, userMenuButton } from '../targets/app-frame';

export const sectionShown = (heading: string) => Visibility.of(pageSection(heading));
export const llmRecipientNotice = (heading: string) => Text.of(llmRecipient(heading));
export const draftNoticeText = (heading: string) => Text.of(draftNotice(heading));
export const operatorNoticeText = (heading: string) => Text.of(operatorNotice(heading));
/** Width the page title gets on screen, in pixels */
export const pageTitleWidth = Width.of(pageTitle);
export const pageOverflowsSideways = question(
	'whether the page scrolls sideways',
	async (actor) => (await actor.answer(ThePage.sidewaysOverflow)) > 0
);
export const userMenuCount = Count.of(userMenuButton);
