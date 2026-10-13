import { Count, Text, ThePage, Visibility, Width } from '../screenplay/questions';
import { draftNotice, llmRecipient, operatorNotice, pageSection, pageTitle, userMenuButton } from '../targets/app-frame';

export const sectionShown = (heading: string) => Visibility.of(pageSection(heading));
export const llmRecipientNotice = (heading: string) => Text.of(llmRecipient(heading));
export const draftNoticeText = (heading: string) => Text.of(draftNotice(heading));
export const operatorNoticeText = (heading: string) => Text.of(operatorNotice(heading));
/** Width the page title gets on screen, in pixels */
export const pageTitleWidth = Width.of(pageTitle);
/** How far the page scrolls sideways, in pixels */
export const pageSidewaysOverflow = ThePage.sidewaysOverflow;
export const userMenuCount = Count.of(userMenuButton);
