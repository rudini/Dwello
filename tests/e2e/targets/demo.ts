import { target } from '../screenplay/target';

export const demoNotice = target('Demo-Hinweis', (page) => page.getByTestId('demo-notice'));
