import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { openPage } from '../tasks/navigation';

const { When } = createBdd(test);

When('der Liegenschaftsverwalter die Berichte öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openPage('/reports'));
});
