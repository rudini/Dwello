import { type Activity } from '../screenplay/actor';
import { Click, DownloadFrom, Select, Wait } from '../screenplay/interactions';
import { annualReportBuilding, annualReportDownload, annualReportYear, showAnnualReport } from '../targets/annual-report';
import { openPage } from './navigation';

// #1409: «Auswertungen», the building and the year chosen, the report shown
export const openAnnualReport =
	(buildingId: string, year: number): Activity =>
	(actor) =>
		actor.attemptsTo(
			openPage('/analytics'),
			Select.option(buildingId).from(annualReportBuilding),
			Select.option(String(year)).from(annualReportYear),
			Click.on(showAnnualReport),
			// the report of this building and year, not the one the page showed first (review 1409-1 C-2)
			Wait.forUrl((url) => url.searchParams.get('building') === buildingId && url.searchParams.get('year') === String(year))
		);

export const downloadAnnualReport =
	(buildingId: string, year: number, kind: 'csv' | 'pdf'): Activity =>
	(actor) =>
		actor.attemptsTo(openAnnualReport(buildingId, year), DownloadFrom(annualReportDownload(kind)));
