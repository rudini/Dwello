import type { Actor } from '../fixtures/actor';
import { deleteButton, editButton, monthShare, profileCard, profileTotal } from '../interactions/heating-profiles';

export const shareOf = (actor: Actor, month: string) => monthShare(actor.page, month);
export const totalShare = (actor: Actor) => profileTotal(actor.page);
export const listedProfile = (actor: Actor, name: string) => profileCard(actor.page, name);
export const profileActions = (actor: Actor) => editButton(actor.page).or(deleteButton(actor.page));
