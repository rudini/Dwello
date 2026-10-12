import { randomUUID } from 'crypto';
import type { APIRequestContext, APIResponse } from '@playwright/test';

const BACKEND_API = 'http://localhost:3101/api/v1'; // E2E backend (playwright.config.ts)

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
	const extras: string[] = []; // invoices and configuration records, removed before their building
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

	async function removeTenants(token: string) {
		for (const tenant of (await get(`tenants?search=${token}`)).tenants) {
			for (const statement of (await get(`statements?tenantId=${tenant.id}&limit=100`)).data) {
				await remove(`statements/${statement.id}`);
			}
			await removeContracts(`tenantId=${tenant.id}`);
			await remove(`tenants/${tenant.id}`);
		}
	}

	async function removeHeatingProfiles(token: string) {
		for (const profile of (await get(`heating-profiles?search=${token}`)).data) {
			await remove(`heating-profiles/${profile.id}`);
		}
	}

	async function removeDistributionKeys(token: string) {
		for (const key of (await get(`distribution-keys?search=${token}`)).data) {
			await remove(`distribution-keys/${key.id}`);
		}
	}

	async function removeCategories(token: string) {
		for (const category of (await get(`categories?search=${token}`)).categories) {
			await remove(`categories/${category.id}`);
		}
	}

	async function invoice(
		buildingTitle: string,
		{ categoryId, distributionKeyId, ...values }: { categoryId?: string; distributionKeyId?: string; [field: string]: unknown },
		description: string,
		amount: string,
		invoiceDate: string
	) {
		const keys = (await get('distribution-keys')).data;
		const created = await post('invoices', {
			buildingId: ids.get(buildingTitle),
			categoryId: categoryId ?? (await get('categories?search=Caretaker')).categories[0].id,
			distributionKeyId: distributionKeyId ?? keys.find((k: { name: string }) => k.name === 'Per Area (m²)').id,
			billingEntityName: 'Muster AG',
			description,
			amount,
			invoiceDate,
			isValidUtilityCost: true,
			...values
		});
		extras.unshift(`invoices/${created.id}`);
		return created.id as string;
	}

	async function removeBuildings(token: string) {
		for (const building of (await get(`buildings?search=${token}`)).buildings) {
			for (const apartment of (await get(`apartments?buildingId=${building.id}&limit=100`)).apartments) {
				await removeContracts(`apartmentId=${apartment.id}`);
				await remove(`apartments/${apartment.id}`);
			}
			// Invoices entered through the UI
			for (const invoice of (await get(`invoices?buildingId=${building.id}&limit=100`)).invoices) {
				await remove(`invoices/${invoice.id}`);
			}
			await remove(`buildings/${building.id}`);
		}
	}

	return {
		names,
		idOf: (key: string) => ids.get(key),
		backend: { get, post }, // the backend API as the signed-in Liegenschaftsverwalter (API protocol driver)
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

		async apartment(buildingTitle: string, number: string, status: string, area = '70') {
			const apartment = await post('apartments', {
				buildingId: ids.get(buildingTitle),
				number,
				floor: 1,
				area,
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

		// Unique per scenario: tenants of parallel scenarios must not share an address
		async email(tenantTitle: string) {
			const email = `${ids.get(tenantTitle)}@dwello.test`;
			await put(`tenants/${ids.get(tenantTitle)}`, { email });
			names.set(`E-Mail ${tenantTitle}`, email);
		},

		async phone(tenantTitle: string, phone: string) {
			await put(`tenants/${ids.get(tenantTitle)}`, { phone });
		},

		// E-mail address and postal address, so both channels can deliver
		async language(tenantTitle: string, language: string) {
			await put(`tenants/${ids.get(tenantTitle)}`, { language });
		},

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

		// Global setting: every scenario that needs one uses the same IBAN, so parallel runs agree
		async iban(iban: string) {
			await put('config', { iban: iban.replace(/\s/g, '') });
		},

		async statementPdf(tenantTitle: string, year: number) {
			await post(`statements/${ids.get(`Abrechnung ${tenantTitle} ${year}`)}/generate-pdf`, {});
		},

		async paymentDeadline(tenantTitle: string, year: number, date: string) {
			await put(`statements/${ids.get(`Abrechnung ${tenantTitle} ${year}`)}`, { paymentDeadline: date });
		},

		async contractEnd(tenantTitle: string, endDate: string) {
			await put(`contracts/${ids.get(`Mietvertrag ${tenantTitle}`)}`, { endDate });
		},

		// an open-ended contract ended by notice, as «Mietvertrag beenden» stores it
		async notice(tenantTitle: string, endDate: string) {
			await put(`contracts/${ids.get(`Mietvertrag ${tenantTitle}`)}`, { endDate, terminated: true });
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
			await invoice(buildingTitle, { categoryId: heating.id }, `Heizöl ${year}`, amount, `${year}-06-30`);
		},

		// Value of the heating oil in the building's tank on a reading day (removed with the building)
		async fuelStock(buildingTitle: string, readingDate: string, amount: string) {
			const heating = (await get('categories?limit=100')).categories.find((c: { name: string }) => c.name === 'Heating');
			await post(`buildings/${ids.get(buildingTitle)}/fuel-stocks`, { readingDate, amount, categoryId: heating.id });
		},

		// Invoice in a predefined category given by its German name, distributed by area; optionally the period it bills
		async invoiceOn(buildingTitle: string, categoryName: string, amount: string, date: string, service?: [string, string]) {
			const category = (await get('categories?limit=100')).categories.find((c: { nameDE: string }) => c.nameDE === categoryName);
			const period = service && { servicePeriodStart: service[0], servicePeriodEnd: service[1] };
			return invoice(buildingTitle, { categoryId: category.id, ...period }, `${categoryName} ${date}`, amount, date);
		},

		async category(title: string, isAllowedUtilityCost: boolean) {
			const name = unique(title);
			const category = await post('categories', { name, nameDE: name, isAllowedUtilityCost });
			ids.set(title, category.id);
			extras.push(`categories/${category.id}`);
		},

		async invoiceInCategory(buildingTitle: string, categoryTitle: string) {
			await invoice(buildingTitle, { categoryId: ids.get(categoryTitle) }, 'Reinigung Q1', '450.00', '2026-03-31');
		},

		// Invoice of a supplier, in a predefined category given by its German name, dated today
		async supplierInvoice(supplier: string, buildingTitle: string, amount: string, description: string, categoryName: string) {
			const category = (await get('categories?limit=100')).categories.find((c: { nameDE: string }) => c.nameDE === categoryName);
			const id = await invoice(
				buildingTitle,
				{ categoryId: category.id, billingEntityName: unique(supplier), isValidUtilityCost: category.isAllowedUtilityCost },
				description,
				amount,
				new Date().toISOString().split('T')[0]
			);
			ids.set(`Rechnung ${supplier}`, id);
		},

		// The KI suggested the category the supplier's invoice has
		async kiSuggestion(supplier: string) {
			const id = ids.get(`Rechnung ${supplier}`);
			const { categoryId } = await get(`invoices/${id}`);
			await put(`invoices/${id}`, { llmCategoryId: categoryId, llmConfidence: '0.9' });
		},

		async distributionKey(title: string, formula: string) {
			const name = unique(title);
			const key = await post('distribution-keys', { name, nameDE: name, type: 'custom', formula });
			ids.set(title, key.id);
			extras.push(`distribution-keys/${key.id}`);
		},

		async invoiceByKey(buildingTitle: string, keyTitle: string) {
			await invoice(buildingTitle, { distributionKeyId: ids.get(keyTitle) }, 'Hauswart Q1', '900.00', '2026-03-31');
		},

		async cleanUp() {
			const tokens = [...names.values()].map((name) => name.split(' ').pop()!);
			for (const token of tokens) await removeTenants(token);
			for (const path of extras) await remove(path);
			// Heating profiles created through the UI carry a scenario name as well
			for (const token of tokens) await removeHeatingProfiles(token);
			for (const token of tokens) await removeCategories(token);
			for (const token of tokens) await removeDistributionKeys(token);
			for (const token of tokens) await removeBuildings(token);
		}
	};
}

export type TestData = ReturnType<typeof testData>;
