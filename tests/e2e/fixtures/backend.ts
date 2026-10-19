import { execFileSync } from 'child_process';
import { randomUUID } from 'crypto';
import type { CallTheApi } from '../screenplay/abilities';
import { inDays } from './dates';

// Scenario-scoped test data: Gherkin names map to names with 12 random hex digits, and everything is removed afterwards.
export function testData(api: CallTheApi) {
	const names = new Map<string, string>();
	const ids = new Map<string, string>();
	const post = (path: string, data: object) => api.post(path, data);
	const get = (path: string) => api.get(path);
	const put = (path: string, data: object) => api.put(path, data);
	const remove = (path: string) => api.remove(path);
	const extras: string[] = []; // invoices and configuration records, removed before their building
	const restores: (() => Promise<unknown>)[] = []; // predefined records a scenario changed
	const unique = (title: string) => {
		// 12 hex digits without hyphens: Firefox and WebKit do not break a UUID's digit groups, so a full UUID in a name
		// made pages wider than 390 px there (#424); 48 bits keep the names of one run apart
		const name = `${title} ${randomUUID().replaceAll('-', '').slice(0, 12)}`;
		names.set(title, name);
		return name;
	};

	async function addCategory(title: string, fields: (name: string) => object) {
		const name = unique(title);
		const category = await post('categories', { name, nameDE: name, ...fields(name) });
		ids.set(title, category.id);
		extras.push(`categories/${category.id}`);
	}

	// A predefined category by its German name
	async function predefinedCategory(categoryName: string): Promise<{ id: string; isAllowedUtilityCost: boolean }> {
		return (await get('categories?limit=100')).categories.find((c: { nameDE: string }) => c.nameDE === categoryName);
	}

	// The tenant's statement of the year, also one a run created
	async function statementOf(tenantTitle: string, year: number) {
		const { data } = await get(`statements?tenantId=${ids.get(tenantTitle)}&limit=100`);
		return data.find((s: { periodStart: string }) => s.periodStart.startsWith(`${year}`));
	}

	async function removeContracts(filter: string) {
		for (const contract of (await get(`contracts?${filter}&limit=100`)).contracts) {
			await remove(`contracts/${contract.id}?confirmMistake=true`); // a started one too (#116)
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
		backend: api, // the backend API as the signed-in Liegenschaftsverwalter (API protocol driver)
		unique,

		// a search term with Gherkin names in it: each name becomes the scenario's name ("Seepark B1")
		withNames: (text: string) =>
			[...names.keys()]
				.sort((a, b) => b.length - a.length)
				.reduce((term, title) => term.replace(title, names.get(title)!), text),

		async building(title: string, city: string, street?: string) {
			const building = await post('buildings', {
				name: unique(title),
				address: street ? unique(street) : 'Testweg 1',
				postalCode: '8400',
				city,
				canton: 'ZH'
			});
			ids.set(title, building.id);
		},

		async buildingCoordinates(title: string) {
			await put(`buildings/${ids.get(title)}`, { latitude: '47.5000000', longitude: '8.7200000' });
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
			contract: {
				startDate: string;
				endDate?: string;
				baseRent: string;
				additionalRent?: string;
				monthlyAdvancePayment?: string;
			}
		) {
			const created = await post('contracts', {
				tenantId: ids.get(tenantTitle),
				apartmentId: ids.get(apartmentNumber),
				additionalRent: '0',
				monthlyAdvancePayment: '0',
				// agreed unless a scenario says otherwise: the amounts of the statement scenarios include the run's fee (#89)
				managementFeeAgreed: true,
				...contract
			});
			ids.set(`Mietvertrag ${tenantTitle}`, created.id);
			ids.set(`Wohnung von ${tenantTitle}`, created.apartmentId);
		},

		// «Verwaltungspauschale vereinbart» on the contract, with its own rate or the run's (#89)
		async managementFee(tenantTitle: string, agreed: boolean, percent?: string) {
			await put(`contracts/${ids.get(`Mietvertrag ${tenantTitle}`)}`, {
				managementFeeAgreed: agreed,
				managementFeePercent: percent ?? null
			});
		},

		async advancePayment(tenantTitle: string, monthlyAdvancePayment: string) {
			await put(`contracts/${ids.get(`Mietvertrag ${tenantTitle}`)}`, { monthlyAdvancePayment });
		},

		// «Nebenkostenpauschale»: counts in «Monatlich total», never billed (#429)
		async flatRateUtilityCharge(tenantTitle: string, flatRateUtilityCharge: string) {
			await put(`contracts/${ids.get(`Mietvertrag ${tenantTitle}`)}`, { flatRateUtilityCharge });
		},

		// «Abgerechnet bis»: up to that day the Nebenkosten are billed outside Dwello (#133)
		async billedUntil(tenantTitle: string, billedUntil: string) {
			await put(`contracts/${ids.get(`Mietvertrag ${tenantTitle}`)}`, { billedUntil });
		},

		// Whether the contract agrees a category (#91): an own category by its title, else a predefined one by its German name
		async agreement(tenantTitle: string, categoryTitle: string, agreed: boolean) {
			const categoryId = ids.get(categoryTitle) ?? (await predefinedCategory(categoryTitle)).id;
			await put(`contracts/${ids.get(`Mietvertrag ${tenantTitle}`)}/agreements`, { categoryId, agreed });
		},

		// A whole year, or the period given (a statement of a shorter period is still named by its year)
		async statement(
			tenantTitle: string,
			buildingTitle: string,
			year: number,
			heatingProfileTitle?: string,
			period?: [string, string],
			managementFeePercent?: number
		) {
			const statement = await post('statements/generate', {
				contractId: ids.get(`Mietvertrag ${tenantTitle}`),
				buildingId: ids.get(buildingTitle),
				periodStart: period?.[0] ?? `${year}-01-01`,
				periodEnd: period?.[1] ?? `${year}-12-31`,
				heatingProfileId: heatingProfileTitle && ids.get(heatingProfileTitle),
				managementFeePercent
			});
			ids.set(`Abrechnung ${tenantTitle} ${year}`, statement.id);
		},

		// Unique per scenario: tenants of parallel scenarios must not share an address; the mail catcher refuses
		// abgewiesen.dwello.test
		async email(tenantTitle: string, domain = 'dwello.test') {
			const email = `${ids.get(tenantTitle)}@${domain}`;
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

		// A Korrespondenzadresse by letter, abroad when a country code is given (#102)
		async address(tenantTitle: string, address: string, postalCode: string, city: string, country: string) {
			await put(`tenants/${ids.get(tenantTitle)}`, { address, postalCode, city, country, correspondenceChannel: 'letter' });
		},

		// The building's address still stored as the tenant's, written differently, as a landlord types it (A-5, #114)
		async buildingAddress(tenantTitle: string, buildingTitle: string) {
			const building = await get(`buildings/${ids.get(buildingTitle)}`);
			await put(`tenants/${ids.get(tenantTitle)}`, {
				address: ` ${building.address.toUpperCase()}  `,
				postalCode: building.postalCode,
				city: building.city,
				correspondenceChannel: 'letter'
			});
		},

		async noEmail(tenantTitle: string) {
			await put(`tenants/${ids.get(tenantTitle)}`, { email: null });
		},

		// A PDF the Liegenschaftsverwalter uploaded to the tenant
		async upload(tenantTitle: string, title: string) {
			const content = Buffer.from('%PDF-1.4\n%%EOF\n').toString('base64');
			await post(`tenants/${ids.get(tenantTitle)}/documents`, { title, fileName: `${title}.pdf`, content });
		},

		async remind(tenantTitle: string, year: number) {
			const { document } = await post(`statements/${ids.get(`Abrechnung ${tenantTitle} ${year}`)}/reminders`, {});
			ids.set(`Mahnung ${tenantTitle} ${year}`, document.id);
		},

		// Global setting: every scenario that needs one uses the same IBAN, so parallel runs agree
		async iban(iban: string) {
			await put('config', { iban: iban.replace(/\s/g, '') });
		},

		async removeBuilding(title: string) {
			await remove(`buildings/${ids.get(title)}`);
		},

		// a statement seeded here, or one a run created
		async removeStatement(tenantTitle: string, year: number) {
			await remove(`statements/${ids.get(`Abrechnung ${tenantTitle} ${year}`) ?? (await statementOf(tenantTitle, year)).id}`);
		},

		async statementNumber(tenantTitle: string, year: number): Promise<string> {
			return (await statementOf(tenantTitle, year)).statementNumber;
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

		// the tenant left after an agreed end, as «Mieter ist ausgezogen» stores it (A-6, #115)
		async movedOut(tenantTitle: string) {
			await put(`contracts/${ids.get(`Mietvertrag ${tenantTitle}`)}`, { movedOut: true });
		},

		async sendStatement(tenantTitle: string, year: number) {
			await put(`statements/${ids.get(`Abrechnung ${tenantTitle} ${year}`)}/status`, { status: 'sent' });
		},

		async contractStart(tenantTitle: string, startDate: string) {
			await put(`contracts/${ids.get(`Mietvertrag ${tenantTitle}`)}`, { startDate });
		},

		// #120: the statement is replaced; `correct` also creates its berichtigte Abrechnung
		async replaceStatement(tenantTitle: string, year: number, correct = false) {
			const id = ids.get(`Abrechnung ${tenantTitle} ${year}`);
			await post(`statements/${id}/replace`, {});
			if (correct) ids.set(`Berichtigte Abrechnung ${tenantTitle} ${year}`, (await post(`statements/${id}/correction`, {})).id);
		},

		async resetPayment(tenantTitle: string, year: number) {
			await post(`statements/${ids.get(`Abrechnung ${tenantTitle} ${year}`)}/payment-reset`, {});
		},

		// paid today, the earliest day a statement sent today allows (#138)
		async markPaid(tenantTitle: string, year: number) {
			await put(`statements/${ids.get(`Abrechnung ${tenantTitle} ${year}`)}/status`, { status: 'paid', paidDate: inDays(0) });
		},

		// Monthly shares January..December in percent
		// A profile of the scenario, or a predefined one by its German name: named explicitly, never the preselection, which
		// a parallel scenario's own profile can take (own profiles are listed first)
		async heatingProfileId(title: string) {
			const profiles: { id: string; nameDE: string | null }[] = (await get('heating-profiles?limit=100')).data;
			return ids.get(title) ?? profiles.find((profile) => profile.nameDE === title)!.id;
		},

		async heatingProfile(title: string, monthly: number[]) {
			const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
			const profile = await post('heating-profiles', {
				name: unique(title),
				...Object.fromEntries(months.map((month, i) => [`${month}Pct`, monthly[i]]))
			});
			ids.set(title, profile.id);
			extras.push(`heating-profiles/${profile.id}`);
		},

		// The landlord renames an own profile later (#229)
		async renameHeatingProfile(title: string, newTitle: string) {
			await put(`heating-profiles/${ids.get(title)}`, { name: unique(newTitle) });
		},

		// The landlord changes the monthly shares of an own profile later (#209)
		async changeHeatingProfile(title: string, monthly: number[]) {
			const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
			await put(`heating-profiles/${ids.get(title)}`, Object.fromEntries(months.map((month, i) => [`${month}Pct`, monthly[i]])));
		},

		// Heating costs of the building, distributed by area
		async heatingInvoice(buildingTitle: string, amount: string, year: number) {
			const heating = (await get('categories?limit=100')).categories.find((c: { name: string }) => c.name === 'Heating');
			await invoice(buildingTitle, { categoryId: heating.id }, `Heizöl ${year}`, amount, `${year}-06-30`);
		},

		// The landlord records that the building has no tank or that its tank is decommissioned (#72)
		async noTank(buildingTitle: string) {
			await put(`buildings/${ids.get(buildingTitle)}`, { noTank: true });
		},

		// Value of the heating oil in the building's tank on a reading day (removed with the building)
		async fuelStock(buildingTitle: string, readingDate: string, amount: string) {
			const heating = (await get('categories?limit=100')).categories.find((c: { name: string }) => c.name === 'Heating');
			await post(`buildings/${ids.get(buildingTitle)}/fuel-stocks`, { readingDate, amount, categoryId: heating.id });
		},

		// Invoice in a predefined category given by its German name, distributed by area; optionally the period it bills
		async invoiceOn(buildingTitle: string, categoryName: string, amount: string, date: string, service?: [string, string]) {
			const category = await predefinedCategory(categoryName);
			const period = service && { servicePeriodStart: service[0], servicePeriodEnd: service[1] };
			const id = await invoice(buildingTitle, { categoryId: category.id, ...period }, `${categoryName} ${date}`, amount, date);
			ids.set(`Rechnung ${categoryName} ${date}`, id);
			return id;
		},

		// A recorded invoice that costs another amount afterwards
		async invoiceAmount(key: string, amount: string) {
			await put(`invoices/${ids.get(key)}`, { amount });
		},

		async predefinedCategoryId(categoryName: string): Promise<string> {
			return (await predefinedCategory(categoryName)).id;
		},

		// A predefined category given by its German name, saved with another allocability; restored afterwards. Saving it
		// as not umlagefähig also marks its invoices so, which the restore does not undo: use a category no scenario bills
		async predefinedCategoryAllowance(categoryName: string, isAllowedUtilityCost: boolean) {
			const category = await predefinedCategory(categoryName);
			await put(`categories/${category.id}`, { isAllowedUtilityCost });
			restores.push(() => put(`categories/${category.id}`, { isAllowedUtilityCost: category.isAllowedUtilityCost }));
		},

		category: (title: string, isAllowedUtilityCost: boolean) => addCategory(title, () => ({ isAllowedUtilityCost })),

		// An own allocable category shared like heating, not marked as fuel (#100)
		heatingCategory: (title: string) => addCategory(title, () => ({ isAllowedUtilityCost: true, isHeatingCost: true })),

		// An own fuel category with a Tankbestand of the building; the reading goes before the category (#100)
		async fuelCategoryWithStock(buildingTitle: string, categoryTitle: string) {
			await addCategory(categoryTitle, () => ({ isAllowedUtilityCost: true, isHeatingCost: true, isFuel: true }));
			const path = `buildings/${ids.get(buildingTitle)}/fuel-stocks`;
			const stock = await post(path, { readingDate: '2025-12-31', amount: '900.00', categoryId: ids.get(categoryTitle) });
			extras.unshift(`${path}/${stock.id}`);
		},

		async categoryAllowance(title: string, isAllowedUtilityCost: boolean) {
			await put(`categories/${ids.get(title)}`, { isAllowedUtilityCost });
		},

		// An own category whose English name is its German one, as an own «Internet» would have
		categoryNamedAlikeInEnglish: (title: string, description: string) =>
			addCategory(title, (name) => ({ nameEN: name, description, isAllowedUtilityCost: true })),

		async invoiceInCategory(buildingTitle: string, categoryTitle: string) {
			await invoice(buildingTitle, { categoryId: ids.get(categoryTitle) }, 'Reinigung Q1', '450.00', '2026-03-31');
		},

		// Invoice without a Kategorie, distributed by area: billed as «Nicht kategorisiert»
		async invoiceWithoutCategory(buildingTitle: string, amount: string, date: string) {
			await invoice(buildingTitle, {}, `Ohne Kategorie ${date}`, amount, date).then((id) => put(`invoices/${id}`, { categoryId: null }));
		},

		// Invoice in an own category, distributed by area
		async invoiceInOwnCategory(buildingTitle: string, categoryTitle: string, amount: string, date: string) {
			await invoice(buildingTitle, { categoryId: ids.get(categoryTitle) }, `${categoryTitle} ${date}`, amount, date);
		},

		// Invoice of a supplier, in an own category the scenario created or a predefined one given by its German name,
		// dated today with a Beleg as «Rechnungen hochladen» creates it: the file and what the KI saw on it
		async supplierInvoice(
			supplier: string,
			buildingTitle: string,
			amount: string,
			description: string,
			categoryName: string,
			beleg?: { fileName: string; deductedAmount: string; nonAllocableItems: boolean }
		) {
			const category: { id: string; isAllowedUtilityCost: boolean } = ids.has(categoryName)
				? await get(`categories/${ids.get(categoryName)}`)
				: await predefinedCategory(categoryName);
			const content = Buffer.from('%PDF-1.4\n%%EOF\n').toString('base64');
			const id = await invoice(
				buildingTitle,
				{
					categoryId: category.id,
					billingEntityName: unique(supplier),
					isValidUtilityCost: category.isAllowedUtilityCost,
					...(beleg && { beleg: { ...beleg, content } })
				},
				description,
				amount,
				inDays(0)
			);
			ids.set(`Rechnung ${supplier}`, id);
		},

		// The Protokoll's entries about the category, deleted as another tab or visitor would (#357)
		async removeAuditEntriesOfCategory(title: string) {
			for (const entry of (await get('audit-log')).data) {
				if (entry.details.categoryId === ids.get(title)) await remove(`audit-log/${entry.id}`);
			}
		},

		async invoiceDate(supplier: string, invoiceDate: string) {
			await put(`invoices/${ids.get(`Rechnung ${supplier}`)}`, { invoiceDate });
		},

		async invoiceAllocable(supplier: string, isValidUtilityCost: boolean) {
			await put(`invoices/${ids.get(`Rechnung ${supplier}`)}`, { isValidUtilityCost });
		},

		async invoiceWithoutKey(supplier: string) {
			await put(`invoices/${ids.get(`Rechnung ${supplier}`)}`, { distributionKeyId: null });
		},

		async invoiceNumber(supplier: string, invoiceNumber: string) {
			await put(`invoices/${ids.get(`Rechnung ${supplier}`)}`, { invoiceNumber });
		},

		// The original file of the supplier's invoice
		async beleg(supplier: string, fileName: string) {
			await this.belegFor(ids.get(`Rechnung ${supplier}`)!, fileName);
		},

		async belegFor(invoiceId: string, fileName: string) {
			const content = Buffer.from('%PDF-1.4\n%%EOF\n').toString('base64');
			await put(`invoices/${invoiceId}/document`, { fileName, content });
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
			for (const restore of restores) await restore();
			const tokens = [...names.values()].map((name) => name.split(' ').pop()!);
			// the backend deletes draft statements only; a sent one would keep its tenant, apartment and building (O-38)
			execFileSync('bun', ['run', 'e2e-purge-statements', ...tokens], {
				cwd: 'backend',
				env: { ...process.env, DATABASE_URL: process.env.E2E_DATABASE_URL }
			});
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
