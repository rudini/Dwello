import type { Actor } from '../fixtures/actor';
import { allowedBadge, categoryRow, deleteButton, usage } from '../interactions/categories';

export const listedCategory = (actor: Actor, name: string) => categoryRow(actor.page, name);
export const isAllowed = (actor: Actor, name: string) => allowedBadge(actor.page, name);
export const invoicesOf = (actor: Actor, name: string) => usage(actor.page, name);
export const deletion = (actor: Actor, name: string) => deleteButton(actor.page, name);
