import type { Actor } from '../fixtures/actor';
import {
	confirmDeleteContractButton,
	contractApartment,
	contractStatus,
	contractTotalRent
} from '../interactions/contract-detail';

export const apartmentOfContract = (actor: Actor) => contractApartment(actor.page);
export const totalRent = (actor: Actor) => contractTotalRent(actor.page);
export const statusOfContract = (actor: Actor) => contractStatus(actor.page);
export const deleteConfirmation = (actor: Actor) => confirmDeleteContractButton(actor.page);
