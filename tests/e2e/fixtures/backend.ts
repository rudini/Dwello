import { randomUUID } from 'crypto';
import type { APIRequestContext, APIResponse } from '@playwright/test';

const BACKEND_API = 'http://localhost:3001/api/v1';

async function body(response: APIResponse) {
	if (!response.ok()) throw new Error(`${response.url()} antwortet ${response.status()}: ${await response.text()}`);
	return response.json();
}

// Scenario-scoped test data: Gherkin names map to UUID-namespaced names, and everything is removed afterwards.
export function testData(request: APIRequestContext, token: string) {
	const names = new Map<string, string>();
	const ids = new Map<string, string>();
	const headers = { Authorization: `Bearer ${token}` };
	const post = (path: string, data: object) => request.post(`${BACKEND_API}/${path}`, { data, headers }).then(body);
	const get = (path: string) => request.get(`${BACKEND_API}/${path}`, { headers }).then(body);
	const put = (path: string, data: object) => request.put(`${BACKEND_API}/${path}`, { data, headers }).then(body);
	const remove = (path: string) => request.delete(`${BACKEND_API}/${path}`, { headers });
	const extras: string[] = []; // invoices and heating profiles, removed before their building
	const unique = (title: string) => {
		const name = `${title} ${randomUUID()}`;
		names.set(title, name);
		return name;
	};

	async function removeContracts(filter: string) {
		for (const contract of (await get(`contracts?${filter}&limit=100`)).contracts) {
			await remove(`contracts/${contract.id}`);
		}
	}

	return {
		names,
		idOf: (key: string) => ids.get(key),
		unique,

		async building(title: string, city: string) {
			const building = await post('buildings', {
				name: unique(title),
				address: 'Testweg 1',
				postalCode: '8400',
				city,
				canton: 'ZH'
			});
			ids.set(title, building.id);
		},

		async apartment(buildingTitle: string, number: string, status: string) {
			const apartment = await post('apartments', {
				buildingId: ids.get(buildingTitle),
				number,
				floor: 1,
				area: '70',
				rooms: '3.5',
				status
			});
			ids.set(number, apartment.id);
		},

		async tenant(title: string) {
			const [, token] = unique(title).split(/ (?=[^ ]+$)/);
			const tenant = await post('tenants', { firstName: title, lastName: token });
			ids.set(title, tenant.id);
		},

		async contract(
			tenantTitle: string,
			apartmentNumber: string,
			contract: { startDate: string; endDate?: string; baseRent: string; monthlyAdvancePayment?: string }
		) {
			const created = await post('contracts', {
				tenantId: ids.get(tenantTitle),
				apartmentId: ids.get(apartmentNumber),
				additionalRent: '0',
				monthlyAdvancePayment: '0',
				...contract
			});
			ids.set(`Mietvertrag ${tenantTitle}`, created.id);
			ids.set(`Wohnung von ${tenantTitle}`, created.apartmentId);
		},

		async statement(tenantTitle: string, buildingTitle: string, year: number, heatingProfileTitle?: string) {
			const statement = await post('statements/generate', {
				contractId: ids.get(`Mietvertrag ${tenantTitle}`),
				buildingId: ids.get(buildingTitle),
				periodStart: `${year}-01-01`,
				periodEnd: `${year}-12-31`,
				heatingProfileId: heatingProfileTitle && ids.get(heatingProfileTitle)
			});
			ids.set(`Abrechnung ${tenantTitle} ${year}`, statement.id);
		},

		// E-mail address and postal address, so both channels can deliver
		async correspondence(tenantTitle: string, channel: 'email' | 'letter') {
			const email = `${ids.get(tenantTitle)}@dwello.test`;
			await put(`tenants/${ids.get(tenantTitle)}`, {
				email,
				address: 'Ahornweg 3',
				postalCode: '8400',
				city: 'Winterthur',
				correspondenceChannel: channel
			});
			names.set(`E-Mail ${tenantTitle}`, email);
		},

		async remind(tenantTitle: string, year: number) {
			await post(`statements/${ids.get(`Abrechnung ${tenantTitle} ${year}`)}/reminders`, {});
		},

		async sendStatement(tenantTitle: string, year: number) {
			await put(`statements/${ids.get(`Abrechnung ${tenantTitle} ${year}`)}/status`, { status: 'sent' });
		},

		// Monthly shares January..December in percent
		async heatingProfile(title: string, monthly: number[]) {
			const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
			const profile = await post('heating-profiles', {
				name: unique(title),
				...Object.fromEntries(months.map((month, i) => [`${month}Pct`, monthly[i]]))
			});
			ids.set(title, profile.id);
			extras.push(`heating-profiles/${profile.id}`);
		},

		// Heating costs of the building, distributed by area
		async heatingInvoice(buildingTitle: string, amount: string, year: number) {
			const heating = (await get('categories?limit=100')).categories.find((c: { name: string }) => c.name === 'Heating');
			const perArea = (await get('distribution-keys')).data.find((k: { name: string }) => k.name === 'Per Area (m²)');
			const invoice = await post('invoices', {
				buildingId: ids.get(buildingTitle),
				categoryId: heating.id,
				distributionKeyId: perArea.id,
				billingEntityName: 'Heizöl AG',
				description: `Heizöl ${year}`,
				amount,
				invoiceDate: `${year}-06-30`,
				isValidUtilityCost: true
			});
			extras.unshift(`invoices/${invoice.id}`);
		},

		async cleanUp() {
			const tokens = [...names.values()].map((name) => name.split(' ').pop());
			for (const token of tokens) {
				for (const tenant of (await get(`tenants?search=${token}`)).tenants) {
					for (const statement of (await get(`statements?tenantId=${tenant.id}&limit=100`)).data) {
						await remove(`statements/${statement.id}`);
					}
					await removeContracts(`tenantId=${tenant.id}`);
					await remove(`tenants/${tenant.id}`);
				}
			}
			for (const path of extras) await remove(path);
			for (const token of tokens) {
				for (const building of (await get(`buildings?search=${token}`)).buildings) {
					for (const apartment of (await get(`apartments?buildingId=${building.id}&limit=100`)).apartments) {
						await removeContracts(`apartmentId=${apartment.id}`);
						await remove(`apartments/${apartment.id}`);
					}
					await remove(`buildings/${building.id}`);
				}
			}
		}
	};
}

export type TestData = ReturnType<typeof testData>;
