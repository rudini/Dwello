import type { Actor } from '../fixtures/actor';
import { cancelButton } from '../interactions/form';
import { breadcrumbLink } from '../interactions/navigation';

export const cancelEditing = async (actor: Actor) => {
	await cancelButton(actor.page).click();
};

export const chooseBreadcrumb = (label: string) => async (actor: Actor) => {
	await breadcrumbLink(actor.page, label).click();
};
