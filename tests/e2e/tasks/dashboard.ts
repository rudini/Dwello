import { Click, Navigate } from '../screenplay/interactions';
import { occupancyBuilding, outdatedDraftsLink, overviewTaskLink, overviewTaskLinkFor, quickAction, statementsTile, statTile } from '../targets/dashboard';

// Labels contain each other ("Vermietet" / "Vermietet ab …"), so tiles are found by their test id
const tiles: Record<string, string> = {
	Gebäude: 'stat-buildings',
	Wohnungen: 'stat-apartments',
	Vermietet: 'stat-occupied',
	'Vermietet ab …': 'stat-relet',
	Leer: 'stat-vacant',
	Gesperrt: 'stat-reserved',
	'Überfällige Beträge': 'stat-overdue-amount'
};
const statementStatuses: Record<string, string> = { Entwürfe: 'draft', Versendet: 'sent', Bezahlt: 'paid', Überfällig: 'overdue' };

export const openDashboard = Navigate.to('/dashboard');
export const openBuildingFromOccupancy = (building: string) => Click.on(occupancyBuilding(building));
export const openTile = (label: string) => Click.on(statTile(tiles[label]));
export const openStatementsWithStatus = (label: string) => Click.on(statementsTile(statementStatuses[label]));
export const chooseQuickAction = (label: string) => Click.on(quickAction(label));
export const startOverviewTask = (title: string) => Click.on(overviewTaskLink(title));
export const startOverviewTaskFor = (title: string, name: string) => Click.on(overviewTaskLinkFor(title, name));

// #454: the drafts of one building and period the task names as not current
export const openOutdatedDrafts = (name: string) => Click.on(outdatedDraftsLink(name));
