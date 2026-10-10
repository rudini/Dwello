import type { Actor } from '../fixtures/actor';
import { pageSection, pageTitle, sidewaysOverflow } from '../interactions/app-frame';

export const sectionTitled = (actor: Actor, heading: string) => pageSection(actor.page, heading);

/** Who receives invoice data for the KI categorization, as the privacy statement names it */
export const llmRecipientNotice = (actor: Actor, heading: string) =>
	pageSection(actor.page, heading).getByTestId('llm-recipient');

/** Where unsaved wizard input stays, as the privacy statement says */
export const draftNotice = (actor: Actor, heading: string) =>
	pageSection(actor.page, heading).getByTestId('draft-notice');

/** Who runs this installation, as the terms of use name them */
export const operatorNotice = (actor: Actor, heading: string) =>
	pageSection(actor.page, heading).getByTestId('terms-operator');

/** Width the page title gets on screen, in pixels */
export const pageTitleWidth = async (actor: Actor) => {
	const title = pageTitle(actor.page);
	await title.waitFor();
	return (await title.boundingBox())?.width ?? 0;
};

export const pageOverflowsSideways = async (actor: Actor) => (await sidewaysOverflow(actor.page)) > 0;
