import type { APIRequestContext } from '@playwright/test';
import type { Actor } from '../fixtures/actor';
import { documentRow, documentStatus, reminderFeedback } from '../interactions/documents';

type Mail = { to: string; subject: string; attachments: string[] };

export const reminderOutcome = (actor: Actor) => reminderFeedback(actor.page);
export const deliveryOf = (actor: Actor, title: string) => documentStatus(actor.page, title);
export const documentFor = (actor: Actor, title: string, tenantName: string) =>
	documentRow(actor.page, title, tenantName);

// Mail received by the mail catcher the backend sends to in E2E runs (playwright.config.ts)
export const mailsTo = async (request: APIRequestContext, address: string) =>
	((await (await request.get('http://localhost:2526/messages')).json()) as Mail[]).filter(
		(m) => m.to === address
	);
