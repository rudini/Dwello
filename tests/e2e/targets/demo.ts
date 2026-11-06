import { target } from '../screenplay/target';

export const demoNotice = target('Demo-Hinweis', (page) => page.getByTestId('demo-notice'));
export const demoNoticeLink = (name: string) =>
	target(`Link «${name}» im Demo-Hinweis`, (page) =>
		demoNotice.locate(page).getByRole('link', { name, exact: true })
	);
