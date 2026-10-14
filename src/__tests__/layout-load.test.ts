import { afterEach, describe, it, expect } from 'vitest';
import { load } from '../routes/+layout.server';

const saved = process.env.DEMO;
afterEach(() => (saved === undefined ? delete process.env.DEMO : (process.env.DEMO = saved)));

const loaded = () => load({ locals: {}, url: new URL('http://localhost/login') } as never);

describe('Rahmen der App laden', () => {
	it('meldet die öffentliche Demo, wenn DEMO=on gesetzt ist', async () => {
		process.env.DEMO = 'on';
		expect(await loaded()).toEqual({ user: null, demo: true });
	});

	it('meldet in einer eigenen Installation keine Demo', async () => {
		delete process.env.DEMO;
		expect(await loaded()).toEqual({ user: null, demo: false });
	});
});
