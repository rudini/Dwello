<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { api } from '$lib/api';
	import { backendMessage } from '$lib/backend-error';
	import { pagesOf } from '$lib/file-pages';
	import {
		MAX_FILES,
		checkRow,
		fileRefusal,
		invoiceOf,
		newRow,
		withoutKi,
		withProposal,
		type Proposal,
		type UploadRow
	} from '$lib/invoice-upload';
	import type { Category } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import Select from '$lib/ui/Select.svelte';
	import InvoiceUploadRow from './InvoiceUploadRow.svelte';
	import UploadFiles from './UploadFiles.svelte';
	import UploadResult from './UploadResult.svelte';

	export type Created = { id: string; name: string };

	// «Rechnungen hochladen»: the building, then up to 20 files; the KI reads each as soon as it is added, the property
	// manager checks the proposals, and only «{n} Rechnungen erstellen» saves anything (#217)
	let {
		open = $bindable(false),
		buildings,
		categories,
		distributionKeys,
		defaultDistributionKeyId,
		oncreated
	}: {
		open?: boolean;
		buildings: { id: string; name: string; address: string }[];
		categories: Category[];
		distributionKeys: { id: string; name: string }[];
		defaultDistributionKeyId: string;
		oncreated: (created: Created[]) => void;
	} = $props();

	let buildingId = $state('');
	let rows = $state<UploadRow[]>([]);
	let pages = $state<Record<number, string[]>>({}); // the images the KI reads, by row
	let errors = $state<Record<number, Record<string, string>>>({}); // what keeps a row from being created
	let created = $state<Created[]>([]);
	let tooMany = $state(false);
	let creating = $state(false);
	let discardOpen = $state(false);
	let nextKey = 0;

	// one building preselected when there is only one
	$effect(() => {
		if (open && !buildingId && buildings.length === 1) buildingId = buildings[0].id;
	});

	const chosen = $derived(rows.filter((row) => row.selected && row.status !== 'reading' && row.status !== 'refused'));
	const resultShown = $derived(created.length > 0);
	const createLabel = $derived(
		chosen.length === 1 ? m.invoices_upload_create_one() : m.invoices_upload_create({ count: chosen.length })
	);

	const update = (key: number, change: (row: UploadRow) => UploadRow) =>
		(rows = rows.map((row) => (row.key === key ? change(row) : row)));

	// What the KI reads from a file; without the KI or a readable file the property manager fills in the fields
	async function read(key: number) {
		update(key, (row) => ({ ...row, status: 'reading' }));
		const row = rows.find((one) => one.key === key)!;
		if (!pages[key]) {
			try {
				pages[key] = await pagesOf(row.file);
			} catch {
				return update(key, (one) => withoutKi(one, 'unreadable'));
			}
		}
		const answer = await api.post<Proposal>('/invoices/extract', {
			buildingId,
			fileName: row.file.name,
			pages: pages[key]
		});
		if (answer.data) update(key, (one) => withProposal(one, answer.data!));
		else if (answer.error?.code === 'EXTRACTION_UNAVAILABLE') update(key, (one) => withoutKi(one, 'unavailable'));
		else update(key, (one) => ({ ...one, status: 'failed' }));
	}

	async function add(files: File[]) {
		tooMany = rows.length + files.length > MAX_FILES;
		for (const file of files.slice(0, MAX_FILES - rows.length)) {
			const row = newRow(nextKey++, file, { distributionKeyId: defaultDistributionKeyId });
			const refusal = await fileRefusal(file);
			rows = [...rows, refusal ? { ...row, status: 'refused', notes: [refusal], selected: false } : row];
			if (!refusal) void read(row.key);
		}
	}

	const remove = (key: number) => (rows = rows.filter((row) => row.key !== key));

	// One invoice with its Beleg; a refusal or a failed request stays at the row with its reason
	async function createOne(row: UploadRow) {
		const form = new FormData();
		form.set('invoice', JSON.stringify(invoiceOf(row, buildingId)));
		form.set('file', row.file);
		const answer = await api.post<{ id: string }>('/invoices', form);
		if (answer.data) {
			created = [...created, { id: answer.data.id, name: row.values.billingEntity.trim() }];
			return remove(row.key);
		}
		const reason = answer.error?.params
			? backendMessage({ code: answer.error.code, params: answer.error.params }, m.invoices_upload_create_failed())
			: m.invoices_upload_create_failed();
		update(row.key, (one) => ({ ...one, createError: reason }));
	}

	async function create() {
		errors = Object.fromEntries(chosen.map((row) => [row.key, checkRow(row)]));
		creating = true;
		for (const row of chosen.filter((one) => !Object.keys(errors[one.key]).length)) {
			update(row.key, (one) => ({ ...one, createError: undefined }));
			await createOne(row);
		}
		creating = false;
		if (!rows.length) finish();
	}

	function finish() {
		oncreated(created);
		open = false;
		buildingId = '';
		rows = [];
		pages = {};
		errors = {};
		created = [];
		tooMany = false;
	}

	// Closing loses the files and what was entered: asked first, unless nothing is there yet
	const requestClose = () => (rows.length ? (discardOpen = true) : finish());
</script>

<Dialog
	bind:open
	wide
	enterConfirms={false}
	title={m.invoices_upload_open()}
	confirmLabel={createLabel}
	confirmDisabled={!chosen.length}
	busy={creating}
	busyLabel={m.ui_saving()}
	confirmTestid="invoice-upload-create-button"
	onrequestclose={requestClose}
	onconfirm={create}
>
	<p class="text-ink">{m.invoices_upload_purpose()}</p>
	<Alert tone="info" title={m.invoices_beleg_title()} testid="invoice-keep-original">
		<p>{m.invoices_upload_keep_original()}</p>
	</Alert>

	{#if resultShown}<UploadResult {created} />{/if}

	<Select
		id="invoice-upload-building"
		label={m.apartments_building()}
		placeholder={m.invoices_choose_building()}
		options={buildings.map((b) => ({ value: b.id, label: `${b.name} – ${b.address}` }))}
		bind:value={buildingId}
		disabled={rows.length > 0}
		testid="invoice-upload-building-select"
	/>

	<UploadFiles enabled={!!buildingId} onfiles={(files) => void add(files)} />

	{#if tooMany}
		<Alert tone="caution" title={m.invoices_upload_open()}><p>{m.invoices_upload_too_many()}</p></Alert>
	{/if}

	{#if rows.length}
		<ul class="flex flex-col divide-y divide-line">
			{#each rows as row, i (row.key)}
				<InvoiceUploadRow
					bind:row={rows[i]}
					preview={pages[row.key]?.[0]}
					errors={errors[row.key] ?? {}}
					{categories}
					{distributionKeys}
					onretry={() => read(row.key)}
					onremove={() => remove(row.key)}
				/>
			{/each}
		</ul>
		{#if !chosen.length}<p class="text-ink-muted">{m.invoices_upload_none_selected()}</p>{/if}
	{/if}
</Dialog>

<Dialog
	bind:open={discardOpen}
	title={m.invoices_upload_discard_title()}
	confirmLabel={m.invoices_upload_discard_confirm()}
	cancelLabel={m.invoices_upload_keep_going()}
	danger
	confirmTestid="invoice-upload-discard-confirm"
	onconfirm={() => {
		discardOpen = false;
		finish();
	}}
>
	<p data-testid="invoice-upload-discard-message">{m.invoices_upload_discard_text()}</p>
</Dialog>
