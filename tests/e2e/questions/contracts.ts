import type { Actor } from '../fixtures/actor';
import { contractAmount, contractRow, contractRows, contractsEmptyNotice } from '../interactions/contracts';

export const listedContract = (actor: Actor, tenantName: string) => contractRow(actor.page, tenantName);
export const allListedContracts = (actor: Actor) => contractRows(actor.page);
export const emptyContractList = (actor: Actor) => contractsEmptyNotice(actor.page);
export const listedAmount = (actor: Actor, tenantName: string, label: string) =>
	contractAmount(actor.page, tenantName, label);
