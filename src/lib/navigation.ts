/** Main menu, shared by the desktop sidebar and the mobile navigation; grouped by the manager's workflow */
export const navGroups = [
	{ label: '', items: [{ name: 'Dashboard', href: '/dashboard', icon: 'dashboard' }] },
	{
		label: 'Liegenschaften',
		items: [
			{ name: 'Gebäude', href: '/buildings', icon: 'apartment' },
			{ name: 'Wohnungen', href: '/apartments', icon: 'door_front' },
			{ name: 'Mieter', href: '/tenants', icon: 'people' },
			{ name: 'Verträge', href: '/contracts', icon: 'description' }
		]
	},
	{
		label: 'Nebenkosten',
		items: [
			{ name: 'Rechnungen', href: '/invoices', icon: 'receipt_long' },
			{ name: 'Abrechnungen', href: '/statements', icon: 'summarize' },
			{ name: 'Dokumente', href: '/documents', icon: 'folder' }
		]
	},
	{
		label: 'System',
		items: [
			{ name: 'Konfiguration', href: '/config', icon: 'settings' },
			{ name: 'Hilfe & Support', href: '/help', icon: 'help' }
		]
	}
];

export function isActive(href: string, currentPath: string): boolean {
	if (href === '/dashboard') {
		return currentPath === '/' || currentPath === '/dashboard';
	}
	return currentPath.startsWith(href);
}
