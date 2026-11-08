import { describe, expect, it } from 'vitest';
import { shot, statesOf } from '../ui-screenshots/shots';

const screens = [
	{ name: 'contracts', path: '/contracts', states: ['default', 'delete-dialog'] },
	{
		name: 'contract-detail',
		path: '/contracts/{contract}',
		states: ['default', 'end-dialog', 'submit-empty']
	},
	{ name: 'contract-detail-ended', path: '/contracts/{endedContract}', states: ['delete-dialog'] },
	{ name: 'contract-new', path: '/contracts/new', states: ['default', 'every-wizard-step'] }
];

describe('statesOf', () => {
	it('takes the dialog states of every screen of the page, and no other state', () => {
		expect(statesOf('/contracts/[id]', screens)).toEqual([
			{ screen: 'contract-detail', state: 'end-dialog' },
			{ screen: 'contract-detail-ended', state: 'delete-dialog' }
		]);
	});

	it('takes the wizard steps of a wizard', () => {
		expect(statesOf('/contracts/new', screens)).toEqual([
			{ screen: 'contract-new', state: 'every-wizard-step' }
		]);
	});

	it('leaves out the upload dialogs, whose Beleg gets a new random name each time', () => {
		const invoices = [
			{ name: 'invoices', path: '/invoices', states: ['upload-dialog', 'upload-discard-dialog'] }
		];
		expect(statesOf('/invoices', invoices)).toEqual([]);
	});

	it('takes nothing for a page without such states', () => {
		expect(statesOf('/buildings', screens)).toEqual([]);
	});
});

describe('shot', () => {
	it('names the file after the page and the look, and titles it with both', () => {
		expect(shot('/buildings/[id]', 'mobile')).toEqual({
			file: 'buildings_id--mobile',
			title: '`/buildings/[id]`, mobile'
		});
	});

	it('names the page alone in its first look, and the overview «home»', () => {
		expect(shot('/')).toEqual({ file: 'home', title: '`/`' });
	});
});
