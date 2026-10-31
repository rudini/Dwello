import { question } from '../screenplay/actor';
import { Count, Text, Visibility } from '../screenplay/questions';
import { currentNavItem } from '../targets/app-frame';
import {
	occupancyCount,
	occupancyRow,
	occupancyVacancyHelp,
	overviewDeadline,
	overviewTask,
	outdatedDraftsTask,
	outdatedDraftsLink,
	overviewTaskTitles,
	overviewTaskFor,
	overviewTasksOf
} from '../targets/dashboard';
import { pageAddress } from './navigation';

// The status a list page was opened with, in the words of the dashboard
const statuses: Record<string, string> = {
	Vermietet: 'occupied',
	'Vermietet ab …': 'relet',
	Leer: 'vacant',
	Gesperrt: 'reserved',
	Entwürfe: 'draft',
	Versendet: 'sent',
	Bezahlt: 'paid',
	Erledigt: 'settled',
	Überfällig: 'overdue'
};

export const rentedApartmentsOf = (building: string) => Text.of(occupancyCount(building));
export const occupancyText = (building: string) => Text.of(occupancyRow(building));
export const occupancyHelp = Text.of(occupancyVacancyHelp);
export const occupancyShown = (building: string) => Visibility.of(occupancyRow(building));
export const overviewTaskShown = (title: string) => Visibility.of(overviewTask(title));
export const overviewTaskText = (title: string) => Text.of(overviewTask(title));
export const overviewTaskTextFor = (title: string, name: string) => Text.of(overviewTaskFor(title, name));
export const overviewTaskShownFor = (title: string, name: string) => Visibility.of(overviewTaskFor(title, name));
export const overviewTasksNaming = (name: string) => Count.of(overviewTasksOf(name));
export const deadlineText = (kind: string, name: string) => Text.of(overviewDeadline(kind, name));
export const deadlines = (kind: string, name: string) => Count.of(overviewDeadline(kind, name));
export const markedNavItems = Text.ofAll(currentNavItem);
/** The status filter a list page was opened with, in the words of the dashboard (null: none) */
export const statusFilterShown = question('the status filter of the list', async (actor) => {
	const status = new URL(await actor.answer(pageAddress)).searchParams.get('status');
	return Object.keys(statuses).find((label) => statuses[label] === status) ?? status;
});
export const outdatedDraftsText = Text.of(outdatedDraftsTask);
export const outdatedDraftsOf = (name: string) => Text.of(outdatedDraftsLink(name));
// the titles of the outdated-drafts task and of another one, in the order the page shows them
export const outdatedDraftsAnd = (title: string) =>
	question(`the order of «nicht aktuell» and «${title}»`, async (actor) =>
		(await actor.answer(Text.ofAll(overviewTaskTitles)))
			.map((shown) => (/nicht aktuell/.test(shown) ? 'nicht aktuell' : shown))
			.filter((shown) => shown === 'nicht aktuell' || shown === title)
	);
