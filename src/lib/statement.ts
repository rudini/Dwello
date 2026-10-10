import type { StatementStatus } from './types';
import type { Tone } from './ui/tone';

export const statusLabels: Record<StatementStatus, string> = {
	draft: 'Entwurf',
	sent: 'Versendet',
	paid: 'Bezahlt',
	overdue: 'Überfällig'
};

export const statusTones: Record<StatementStatus, Tone> = {
	draft: 'neutral',
	sent: 'info',
	paid: 'positive',
	overdue: 'critical'
};

/** The Saldo in words: positive, the tenant pays; negative, the tenant gets money back */
export function balanceLabel(balance: number): string {
	if (balance > 0) return 'Nachzahlung';
	if (balance < 0) return 'Rückerstattung';
	return 'Ausgeglichen';
}
