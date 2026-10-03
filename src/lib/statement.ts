import type { StatementStatus } from './types';

export const statusLabels: Record<StatementStatus, string> = {
	draft: 'Entwurf',
	sent: 'Versendet',
	paid: 'Bezahlt',
	overdue: 'Überfällig'
};

export const statusVariants = {
	draft: 'default',
	sent: 'info',
	paid: 'success',
	overdue: 'danger'
} as const satisfies Record<StatementStatus, string>;

/** Text colour of a balance: red when the tenant pays, green when the tenant gets money back */
export function balanceClass(balance: number): string {
	if (balance > 0) return 'text-red-600';
	if (balance < 0) return 'text-green-600';
	return 'text-gray-600';
}
