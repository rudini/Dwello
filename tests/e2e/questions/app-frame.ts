import type { Actor } from '../fixtures/actor';
import { pageSection } from '../interactions/app-frame';

export const sectionTitled = (actor: Actor, heading: string) => pageSection(actor.page, heading);

/** Who receives invoice data for the KI categorization, as the privacy statement names it */
export const llmRecipientNotice = (actor: Actor, heading: string) =>
	pageSection(actor.page, heading).getByTestId('llm-recipient');
