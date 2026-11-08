import { Click, Enter, Press } from '../screenplay/interactions';
import { cancelButton, fieldLabelled } from '../targets/form';
import type { Activity } from '../screenplay/actor';
import { breadcrumbLink } from '../targets/navigation';

export const cancelEditing = Click.on(cancelButton);
export const chooseBreadcrumb = (label: string) => Click.on(breadcrumbLink(label));

// #1201: a text longer than its column, saved with Enter as in every form (#678)
export const saveTextOfLength = (label: string, length: number): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue('A'.repeat(length)).into(fieldLabelled(label)), Press.theKey('Enter').on(fieldLabelled(label)));
