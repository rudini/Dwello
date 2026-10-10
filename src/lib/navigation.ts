import type { IconName } from './ui/icons';

/** Main menu, one level, grouped by the landlord's work; shared by the sidebar and the mobile menu */
export const navGroups: {
	label: string;
	items: { label: string; href: string; icon: IconName }[];
}[] = [
	{ label: '', items: [{ label: 'Übersicht', href: '/dashboard', icon: 'overview' }] },
	{
		label: 'Verwalten',
		items: [
			{ label: 'Gebäude', href: '/buildings', icon: 'building' },
			{ label: 'Wohnungen', href: '/apartments', icon: 'apartment' },
			{ label: 'Mieter', href: '/tenants', icon: 'users' },
			{ label: 'Mietverträge', href: '/contracts', icon: 'contract' }
		]
	},
	{
		label: 'Nebenkosten',
		items: [
			{ label: 'Rechnungen', href: '/invoices', icon: 'invoice' },
			{ label: 'Nebenkostenabrechnungen', href: '/statements', icon: 'statement' },
			{ label: 'Dokumente', href: '/documents', icon: 'folder' }
		]
	},
	{
		label: 'Einstellungen und Hilfe',
		items: [
			{ label: 'Einstellungen', href: '/config', icon: 'settings' },
			{ label: 'Kategorien', href: '/config/categories', icon: 'category' },
			{ label: 'Verteilschlüssel', href: '/config/distribution-keys', icon: 'sliders' },
			{ label: 'Heizprofile', href: '/config/heating-profiles', icon: 'heating' },
			{ label: 'Hilfe', href: '/help', icon: 'help' }
		]
	}
];

const hrefs = navGroups.flatMap((group) => group.items.map((item) => item.href));

/** The menu item a page belongs to: the longest item path the page lies under ("/" is the overview) */
export function activeHref(path: string): string | undefined {
	if (path === '/') return '/dashboard';
	return hrefs
		.filter((href) => path === href || path.startsWith(`${href}/`))
		.sort((a, b) => b.length - a.length)[0];
}
