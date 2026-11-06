<script lang="ts">
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';
	import type { StatementDocument } from '$lib/types';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import Field from '$lib/ui/Field.svelte';
	import { controlClass } from '$lib/ui/field';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import DocumentItem from './DocumentItem.svelte';
	import MarkSentButton from './MarkSentButton.svelte';
	import MarkedSentNotice from './MarkedSentNotice.svelte';
	import type { ActionData } from './$types';

	let {
		data,
		form
	}: {
		data: {
			documents: StatementDocument[];
			status: string | null;
			tenantId: string | null;
			tenants: { id: string; name: string; place?: string }[];
		};
		form: ActionData;
	} = $props();

	// «Alle» / «Zu versenden» and the filter «Mieter» apply together (#677)
	const listHref = (status: string | null, tenant: string | null) => {
		const query = Object.entries({ status, tenant })
			.filter(([, value]) => value)
			.map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
			.join('&');
		return `/documents${query && `?${query}`}`;
	};
	// applies on change (#662), keeping the focus on the filter
	const chooseTenant = (event: Event) =>
		goto(listHref(data.status, (event.currentTarget as HTMLSelectElement).value || null), {
			keepFocus: true,
			noScroll: true
		});

	const filters = $derived(
		[
			{
				href: listHref(null, data.tenantId),
				label: m.documents_all(),
				testid: 'documents-filter-all',
				active: !data.status
			},
			{
				href: listHref('to_send', data.tenantId),
				label: m.tenants_document_to_send(),
				testid: 'documents-filter-to-send',
				active: data.status === 'to_send'
			}
		].map((filter) => ({
			...filter,
			current: filter.active ? ('page' as const) : undefined,
			look: filter.active
				? 'border-accent bg-accent-soft text-accent-strong'
				: 'border-line-strong bg-surface text-accent hover:bg-accent-soft'
		}))
	);
	// under «Zu versenden» only letters can appear, never uploaded documents; nothing to post needs no way to the
	// statements (persona Marco 2, #677)
	const empty = $derived(
		data.status
			? { title: m.documents_none_to_send(), text: m.documents_empty_to_send_text() }
			: { title: m.documents_empty(), text: m.documents_empty_text() }
	);
</script>

<svelte:head>
	<title>{m.nav_documents()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title={m.nav_documents()}
		purpose={`${m.documents_upload_where()} ${m.documents_purpose()}`}
	/>

	<nav aria-label={m.documents_filter()}>
		<ul class="flex flex-wrap gap-4">
			{#each filters as filter (filter.testid)}
				<li>
					<a
						href={filter.href}
						aria-current={filter.current}
						class="inline-flex min-h-12 items-center rounded-control border-2 px-6 font-semibold {filter.look}"
						data-testid={filter.testid}>{filter.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>

	<Field id="documents-tenant" label={m.contracts_tenant()}>
		{#snippet children(control)}
			<select
				id={control.id}
				aria-describedby={control.describedBy}
				class={controlClass(false)}
				value={data.tenantId ?? ''}
				onchange={chooseTenant}
				data-testid="documents-tenant-filter"
			>
				<option value="">{m.tenants_all()}</option>
				{#each data.tenants as tenant (tenant.id)}
					<option value={tenant.id}
						>{tenant.place ? `${tenant.name}, ${tenant.place}` : tenant.name}</option
					>
				{/each}
			</select>
		{/snippet}
	</Field>

	<!-- a refusal of «Als versendet markieren» shows in its open confirmation (Code-Review 534-2 C-15) -->

	<MarkedSentNotice sent={form?.sent} />

	{#if data.documents.length}
		<ul class="divide-y divide-line rounded-panel border border-line bg-surface px-6">
			{#each data.documents as document (document.id)}
				<DocumentItem {document} showTenant>
					<MarkSentButton {document} error={form?.actionError} />
				</DocumentItem>
			{/each}
		</ul>
	{:else if !form?.sent}
		<!-- not beside a letter just marked: it is still to be printed and posted today -->
		<div data-testid="documents-empty">
			<EmptyState
				illustration="envelope"
				title={empty.title}
				text={empty.text}
				actionLabel={data.status ? undefined : m.documents_to_statements()}
				actionHref="/statements"
			/>
		</div>
	{/if}
</div>
