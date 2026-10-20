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
	import { proposedKey, type LatestKey } from '$lib/invoice';
	import type { Category } from '$lib/types';
	import { formatDate } from '$lib/utils/format';
	import { focusFirstError } from '$lib/ui/focus-error';
	import { tick } from 'svelte';
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
		latestKeys = [],
		oncreated
	}: {
		open?: boolean;
		buildings: { id: string; name: string; address: string; tank?: string }[]; // tank: its category (#451, M-1)
		categories: Category[];
		distributionKeys: { id: string; name: string }[];
		defaultDistributionKeyId: string;
		latestKeys?: LatestKey[];
		oncreated: (created: Created[]) => void;
	} = $props();

	let buildingId = $state('');
	// #379: also a folded row gets the key of its category's latest invoice in the building (code review 452-1 C-1)
	$effect(() => {
		for (const row of rows) {
			const proposal = proposedKey(latestKeys, buildingId, row.values.categoryId, defaultDistributionKeyId);
			if (!row.keyChosen && proposal && row.values.distributionKeyId !== proposal)
				row.values.distributionKeyId = proposal;
		}
	});
	let rows = $state<UploadRow[]>([]);
	let pages = $state<Record<number, string[]>>({}); // the images the KI reads, by row
	let errors = $state<Record<number, Record<string, string>>>({}); // what keeps a row from being created
	let created = $state<Created[]>([]);
	let tooMany = $state(false);
	let creating = $state(false);
	let discardOpen = $state(false);
	let removed = $state(''); // the file just removed, said by the status until the next change
	let nextKey = 0;

	// one building preselected when there is only one
	$effect(() => {
		if (open && !buildingId && buildings.length === 1) buildingId = buildings[0].id;
	});

	const chosen = $derived(rows.filter((row) => row.selected && row.status !== 'reading' && row.status !== 'refused'));
	const resultShown = $derived(created.length > 0);
	// after creating: the files chosen but not created, because they still lack something (persona Anna, C-4)
	const stillOpen = $derived(chosen.map((row) => row.file.name));
	const buildingOptions = $derived(buildings.map((b) => ({ value: b.id, label: `${b.name} – ${b.address}` })));
	const buildingHelp = $derived(rows.length ? m.invoices_upload_building_locked() : undefined);
	const discardText = $derived(
		created.length ? m.invoices_upload_discard_text_created() : m.invoices_upload_discard_text()
	);
	const done = $derived(rows.filter((row) => row.status !== 'reading').length);
	// what a screen reader hears: the progress, when all are read what is to do, or the file just removed (persona Sven)
	const outcome = $derived(
		(
			[
				[m.invoices_upload_status_check(), 'check'],
				[m.invoices_upload_status_refused(), 'refused'],
				[m.invoices_upload_status_error(), 'failed']
			] as const
		)
			.map(([label, status]) => ({ label, count: rows.filter((row) => row.status === status).length }))
			.filter(({ count }) => count > 0)
			.map((part) => m.invoices_upload_summary(part))
	);
	const status = $derived(
		removed
			? m.invoices_upload_removed({ name: removed })
			: !rows.length
				? ''
				: done < rows.length
					? m.invoices_upload_progress({ done, count: rows.length })
					: [`${m.invoices_upload_progress({ done, count: rows.length })}.`, ...outcome].join(' ')
	);
	// the button counts what it creates: a chosen row that still lacks something is named apart (#233)
	const complete = $derived(chosen.filter((row) => !Object.keys(checkRow(row)).length).length);
	const incomplete = $derived(chosen.length - complete);
	const createLabel = $derived(
		[
			complete === 1 ? m.invoices_upload_create_one() : m.invoices_upload_create({ count: complete }),
			incomplete === 1 && m.invoices_upload_incomplete_one(),
			incomplete > 1 && m.invoices_upload_incomplete({ count: incomplete })
		]
			.filter(Boolean)
			.join(' ')
	);

	// a refusal the backend explains in the UI's words (a code with its message), else what failed
	const reasonOf = (error: { code: string; params?: Record<string, string | number> } | undefined, fallback: string) =>
		error?.params ? backendMessage({ code: error.code, params: error.params }, fallback) : fallback;

	const update = (key: number, change: (row: UploadRow) => UploadRow) => {
		removed = '';
		rows = rows.map((row) => (row.key === key ? change(row) : row));
	};

	// What the KI reads from a file; without the KI or a readable file the property manager fills in the fields
	async function read(key: number) {
		update(key, (row) => ({ ...row, status: 'reading' }));
		const { file } = rows.find((one) => one.key === key)!;
		if (!pages[key]) {
			try {
				const read = await pagesOf(file);
				pages[key] = read.pages;
				update(key, (one) => ({ ...one, morePages: read.morePages }));
			} catch {
				return update(key, (one) => withoutKi(one, 'unreadable'));
			}
		}
		const answer = await api.post<Proposal>('/invoices/extract', {
			buildingId,
			fileName: file.name,
			pages: pages[key]
		});
		if (answer.data) update(key, (one) => withProposal(one, answer.data!));
		else if (answer.error?.code === 'EXTRACTION_UNAVAILABLE') update(key, (one) => withoutKi(one, 'unavailable'));
		else update(key, (one) => ({ ...one, status: 'failed', notes: [reasonOf(answer.error, m.invoices_upload_read_failed())] }));
	}

	// The rows are added at once, so a second choice while the first is still checked counts them too
	async function add(files: File[]) {
		tooMany = rows.length + files.length > MAX_FILES;
		const added = files
			.slice(0, Math.max(0, MAX_FILES - rows.length))
			.map((file) => newRow(nextKey++, file, { distributionKeyId: defaultDistributionKeyId }));
		rows = [...rows, ...added];
		for (const row of added) {
			const refusal = await fileRefusal(row.file);
			if (refusal) update(row.key, (one) => ({ ...one, status: 'refused', notes: [refusal], selected: false }));
			else void read(row.key);
		}
	}

	const remove = (key: number) => (rows = rows.filter((row) => row.key !== key));

	// removed by the property manager: said, and the focus goes to where files are added
	async function removeRow(key: number) {
		const name = rows.find((row) => row.key === key)!.file.name;
		remove(key);
		removed = name;
		await tick();
		document.querySelector<HTMLElement>('[data-testid="invoice-upload-file-input"]')?.focus();
	}

	// One invoice with its Beleg; a refusal or a failed request stays at the row with its reason
	async function createOne(row: UploadRow) {
		const form = new FormData();
		form.set('invoice', JSON.stringify(invoiceOf(row, buildingId)));
		form.set('file', row.file);
		const answer = await api.post<{ id: string }>('/invoices', form);
		if (answer.data) {
			// named with its date: two invoices of one Rechnungssteller are told apart (C-27)
			created = [...created, { id: answer.data.id, name: `${row.values.billingEntity.trim()}, ${formatDate(row.values.invoiceDate)}` }];
			return remove(row.key);
		}
		update(row.key, (one) => ({ ...one, createError: reasonOf(answer.error, m.invoices_upload_create_failed()) }));
	}

	async function create() {
		errors = Object.fromEntries(chosen.map((row) => [row.key, checkRow(row)]));
		creating = true;
		for (const row of chosen.filter((one) => !Object.keys(errors[one.key]).length)) {
			update(row.key, (one) => ({ ...one, createError: undefined }));
			await createOne(row);
		}
		creating = false;
		if (!rows.length) return finish();
		// what stays in the dialog: the result first, else the first field to fill in
		await tick();
		const result = document.querySelector<HTMLElement>('[data-testid="invoice-upload-result"]');
		if (result) result.focus();
		else focusFirstError(document.querySelector('[role=dialog]'));
	}

	function finish() {
		if (created.length) oncreated(created);
		open = false;
		buildingId = '';
		rows = [];
		pages = {};
		errors = {};
		created = [];
		tooMany = false;
		removed = '';
	}

	// Closing loses the files and what was entered: asked first, unless nothing is there yet
	const requestClose = () => (rows.length ? (discardOpen = true) : finish());
</script>

<Dialog
	bind:open
	wide
	describedby="invoice-upload-purpose"
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
	<p id="invoice-upload-purpose" class="text-ink">{m.invoices_upload_purpose()}</p>
	<p class="text-ink-muted" data-testid="invoice-keep-original">
		{m.invoices_upload_kept()}
		{m.invoices_upload_keep_original()}
	</p>

	{#if resultShown}<UploadResult {created} open={stillOpen} />{/if}

	<Select
		id="invoice-upload-building"
		label={m.apartments_building()}
		placeholder={m.invoices_choose_building()}
		options={buildingOptions}
		bind:value={buildingId}
		disabled={rows.length > 0}
		help={buildingHelp}
		testid="invoice-upload-building-select"
	/>

	<UploadFiles enabled={!!buildingId} onfiles={(files) => void add(files)} />

	{#if tooMany}
		<Alert tone="caution" title={m.invoices_upload_too_many_title()}><p>{m.invoices_upload_too_many()}</p></Alert>
	{/if}

	<!-- always there, so the first progress and the removal of the last file are heard too -->
	<p role="status" class="text-ink-muted empty:hidden" data-testid="invoice-upload-progress">{status}</p>
	{#if rows.length}
		<ul class="flex flex-col divide-y divide-line">
			{#each rows as row, i (row.key)}
				<InvoiceUploadRow
					bind:row={rows[i]}
					preview={pages[row.key]?.[0]}
					errors={errors[row.key] ?? {}}
					{categories}
					{distributionKeys}
					keyProposal={{ buildingId, latestKeys, defaultKeyId: defaultDistributionKeyId }}
					tank={buildings.find((building) => building.id === buildingId)?.tank}
					onretry={() => read(row.key)}
					onremove={() => removeRow(row.key)}
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
	<p data-testid="invoice-upload-discard-message">{discardText}</p>
</Dialog>
