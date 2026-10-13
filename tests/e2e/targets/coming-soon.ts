import { target } from '../screenplay/target';

export const comingSoonNotice = target('Ankündigung', (page) =>
	page.getByTestId('coming-soon').getByRole('heading', { level: 2 })
);
