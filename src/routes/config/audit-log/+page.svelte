<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { AuditEntry } from '$lib/server/audit-log';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import DeleteDialog from '../DeleteDialog.svelte';
	import type { ActionData, PageData } from './$types';

	// TODO(fachlich prüfen, #370): «Protokoll» has its glossary row; the help texts follow
	let { data, form }: { data: PageData; form: ActionData } = $props();

	let toDelete = $state<AuditEntry | null>(null);
	// what the dialog names; empty while it is closed
	const shown = $derived(toDelete ?? { id: '', when: '', text: '' });
</script>

<svelte:head>
	<title>{m.audit_title()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title={m.audit_title()}
		purpose={m.audit_purpose()}
		trail={[{ href: '/config', label: m.nav_settings() }]}
	/>

	{#if data.entries.length === 0}
		<EmptyState
			title={m.audit_empty_title()}
			text={m.audit_empty_text()}
			illustration="done"
			testid="audit-log-empty"
		/>
	{:else}
		<ul class="flex flex-col gap-4" data-testid="audit-log-list">
			{#each data.entries as entry (entry.id)}
				<li
					class="flex flex-col gap-4 rounded-panel border border-line bg-surface p-4 md:flex-row md:items-center"
					data-testid="audit-entry"
				>
					<div class="flex min-w-0 flex-1 flex-col gap-1">
						<p class="text-ink-muted tabular-nums" data-testid="audit-entry-date">{entry.when}</p>
						<p class="break-words text-ink" data-testid="audit-entry-text">{entry.text}</p>
					</div>
					<Button
						variant="danger-ghost"
						icon="delete"
						onclick={() => (toDelete = entry)}
						ariaLabel={m.audit_delete_label({ when: entry.when, text: entry.text })}
						testid="audit-entry-delete-button">{m.buildings_delete()}</Button
					>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<DeleteDialog
	bind:open={
		() => toDelete !== null,
		(open) => {
			if (!open) toDelete = null;
		}
	}
	record="auditEntry"
	name={shown.text}
	id={shown.id}
	error={form?.error}
	confirmTestid="audit-entry-delete-confirm"
>
	<p data-testid="audit-entry-delete-message">
		{m.audit_delete_text({ when: shown.when, text: shown.text })}
	</p>
</DeleteDialog>
