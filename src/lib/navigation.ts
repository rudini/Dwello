/** Main menu, shared by the desktop sidebar and the mobile navigation */
export const navItems = [
	{ name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
	{ name: 'Gebäude', href: '/buildings', icon: 'apartment' },
	{ name: 'Wohnungen', href: '/apartments', icon: 'door_front' },
	{ name: 'Mieter', href: '/tenants', icon: 'people' },
	{ name: 'Verträge', href: '/contracts', icon: 'description' },
	{ name: 'Rechnungen', href: '/invoices', icon: 'receipt_long' },
	{ name: 'Abrechnungen', href: '/statements', icon: 'summarize' },
	{ name: 'Dokumente', href: '/documents', icon: 'folder' },
	{ name: 'Konfiguration', href: '/config', icon: 'settings' }
];

export function isActive(href: string, currentPath: string): boolean {
	if (href === '/dashboard') {
		return currentPath === '/' || currentPath === '/dashboard';
	}
	return currentPath.startsWith(href);
}
