import type { IconName } from './icons';
import { m } from '$lib/paraglide/messages';

/** Main menu, one level, grouped by the landlord's work; shared by the sidebar and the mobile menu.
 * Labels are getters: read when shown, so they are in the language of the request */
export const navGroups: {
	label: string;
	items: { label: string; href: string; icon: IconName }[];
}[] = [
	{
		label: '',
		items: [
			{
				get label() {
					return m.nav_overview();
				},
				href: '/dashboard',
				icon: 'overview'
			}
		]
	},
	{
		get label() {
			return m.nav_group_manage();
		},
		items: [
			{
				get label() {
					return m.nav_buildings();
				},
				href: '/buildings',
				icon: 'building'
			},
			{
				get label() {
					return m.nav_apartments();
				},
				href: '/apartments',
				icon: 'apartment'
			},
			{
				get label() {
					return m.nav_tenants();
				},
				href: '/tenants',
				icon: 'users'
			},
			{
				get label() {
					return m.nav_contracts();
				},
				href: '/contracts',
				icon: 'contract'
			}
		]
	},
	{
		get label() {
			return m.nav_group_utility_costs();
		},
		items: [
			{
				get label() {
					return m.nav_invoices();
				},
				href: '/invoices',
				icon: 'invoice'
			},
			{
				get label() {
					return m.nav_statements();
				},
				href: '/statements',
				icon: 'statement'
			},
			{
				get label() {
					return m.nav_documents();
				},
				href: '/documents',
				icon: 'folder'
			}
		]
	},
	{
		get label() {
			return m.nav_group_settings_help();
		},
		items: [
			{
				get label() {
					return m.nav_settings();
				},
				href: '/config',
				icon: 'settings'
			},
			{
				get label() {
					return m.nav_categories();
				},
				href: '/config/categories',
				icon: 'category'
			},
			{
				get label() {
					return m.nav_distribution_keys();
				},
				href: '/config/distribution-keys',
				icon: 'sliders'
			},
			{
				get label() {
					return m.nav_heating_profiles();
				},
				href: '/config/heating-profiles',
				icon: 'heating'
			},
			{
				get label() {
					return m.nav_help();
				},
				href: '/help',
				icon: 'help'
			}
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
