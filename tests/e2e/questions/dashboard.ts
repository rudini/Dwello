import { question } from '../screenplay/actor';
import { Count, Text, Visibility } from '../screenplay/questions';
import { currentNavItem } from '../targets/app-frame';
import {
	occupancyCount,
	occupancyRate,
	occupancyRow,
	overviewDeadline,
	overviewTask,
	overviewTaskFor,
	overviewTasksOf
} from '../targets/dashboard';
import { pageAddress } from './navigation';

// The status a list page was opened with, in the words of the dashboard
const statuses: Record<string, string> = {
	Vermietet: 'occupied',
	Wiedervermietet: 'relet',
	Leer: 'vacant',
	Gesperrt: 'reserved',
	Entwürfe: 'draft',
	Versendet: 'sent',
	Bezahlt: 'paid',
	Überfällig: 'overdue'
};

export const occupancyOf = (building: string) => Text.of(occupancyRate(building));
export const rentedApartmentsOf = (building: string) => Text.of(occupancyCount(building));
export const occupancyShown = (building: string) => Visibility.of(occupancyRow(building));
export const overviewTaskShown = (title: string) => Visibility.of(overviewTask(title));
export const overviewTaskText = (title: string) => Text.of(overviewTask(title));
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
