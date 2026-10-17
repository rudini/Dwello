import { target } from '../screenplay/target';

export const occupancyRow = (building: string) =>
	target(`Belegung von ${building}`, (page) =>
		page
			.getByTestId('occupancy-row')
			.filter({ has: page.getByTestId('occupancy-building').getByText(building, { exact: true }) })
	);
const inOccupancy = (building: string, description: string, testId: string) =>
	target(`${description} von ${building}`, (page) => occupancyRow(building).locate(page).getByTestId(testId));
export const occupancyBuilding = (building: string) => inOccupancy(building, 'Gebäude in der Belegung', 'occupancy-building');
export const occupancyCount = (building: string) => inOccupancy(building, 'Vermietete Wohnungen', 'occupancy-count');
export const occupancyVacancyHelp = target('Hinweis zu leeren Wohnungen in der Belegung', (page) =>
	page.getByTestId('occupancy-vacancy-help')
);
export const statTile = (testId: string) => target(`Kennzahl ${testId}`, (page) => page.getByTestId(testId));
export const statementsTile = (status: string) =>
	target(`Abrechnungen ${status}`, (page) => page.getByTestId(`statements-${status}`));
export const quickAction = (label: string) =>
	target(`Schnellaktion «${label}»`, (page) => page.getByTestId('quick-action').filter({ hasText: label }));
export const overviewTask = (title: string) =>
	target(`Aufgabe «${title}»`, (page) => page.getByTestId('overview-task').filter({ hasText: title }));
// a task names the tenant in its text
export const overviewTaskFor = (title: string, name: string) =>
	target(`Aufgabe «${title}» für ${name}`, (page) => overviewTask(title).locate(page).filter({ hasText: name }));
export const overviewTasksOf = (name: string) =>
	target(`Aufgaben für ${name}`, (page) => page.getByTestId('overview-task').filter({ hasText: name }));
export const overviewTaskLink = (title: string) =>
	target(`Aufgabe «${title}» beginnen`, (page) => overviewTask(title).locate(page).getByRole('link'));
export const overviewDeadline = (kind: string, name: string) =>
	target(`Frist ${kind} ${name}`, (page) =>
		page.getByTestId('overview-deadline').filter({ hasText: kind }).filter({ hasText: name })
	);
export const overviewTaskLinkFor = (title: string, name: string) =>
	target(`Aufgabe «${title}» für ${name} beginnen`, (page) => overviewTaskFor(title, name).locate(page).getByRole('link'));
