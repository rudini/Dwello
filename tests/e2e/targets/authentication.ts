import { target } from '../screenplay/target';

export const loginButton = (provider: string) =>
	target(`Anmelden mit ${provider}`, (page) => page.getByTestId(`login-${provider.toLowerCase()}`));
export const loginError = target('Anmeldefehler', (page) => page.getByTestId('login-error'));
export const userName = target('Benutzername', (page) => page.getByTestId('user-name'));
export const logoutButton = target('Abmelden', (page) => page.getByTestId('logout-button'));
