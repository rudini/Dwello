import type { Actor } from '../fixtures/actor';
import { contractRow, contractRows } from '../interactions/contracts';

export const listedContract = (actor: Actor, tenantName: string) => contractRow(actor.page, tenantName);
export const allListedContracts = (actor: Actor) => contractRows(actor.page);
