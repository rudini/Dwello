<script lang="ts">
	import { apiCall } from '$lib/api';
	import { backendMessage } from '$lib/backend-error';
	import { tick } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import Button from './Button.svelte';
	import Dialog from './Dialog.svelte';
	import UpdateProgress from './UpdateProgress.svelte';
	import type { UpdateNotice } from '$lib/update';

	// A new version after sign-in (#1453): one line at the top of every page, «Aktualisieren» after a confirmation,
	// then the update with its step until the page loads again; Fachreview update-1 gives the texts
	let { notice }: { notice: UpdateNotice } = $props();

	// the step of each of the update service's states (UpdateProgress); before them «Sichern», while the backend backs
	// up and has not asked the update service yet (#1457)
	const STEP_OF: Record<string, number> = { pulling: 1, backend: 2, frontend: 2 };
	const SLOW_MS = 15 * 60_000;
	const POLL_MS = 2000;

	let hidden = $state(false);
	let confirming = $state(false);
	let refusal = $state('');
	// why no update started: the Sicherung before it failed
	let notStarted = $state('');
	let phase = $state<'idle' | 'running' | 'failed' | 'restore'>('idle');
	let step = $state(0);
	let slow = $state(false);

	async function later() {
		// remembered first, so the next page already knows it
		await apiCall('/update/later', { method: 'POST' });
		hidden = true;
	}

	async function start() {
		confirming = false;
		refusal = notStarted = '';
		phase = 'running';
		step = 0;
		slow = false;
		const slowTimer = setTimeout(() => (slow = true), SLOW_MS);
		const { error } = await apiCall('/update', { method: 'POST' });
		if (error) {
			clearTimeout(slowTimer);
			const text = backendMessage(error, m.backend_unknown_error());
			// no update failed with the other refusals: they stay in the line (Fachreview backup-first-1 V-4)
			if (error.code !== 'UPDATE_BACKUP_FAILED') return (refusal = text), closeFailure();
			notStarted = text;
			phase = 'failed';
			return;
		}
		step = 1;
		// only now: the update service keeps the end of its last update until the next one starts
		const poll = setInterval(async () => {
			// while the frontend restarts nothing answers: the last step stays
			const state = await fetch('/api/update')
				.then((response) => response.json())
				.then((status: { state: string; restore?: boolean }) => status)
				.catch(() => null);
			if (!state) return;
			if (state.state in STEP_OF) step = STEP_OF[state.state];
			if (state.state !== 'done' && state.state !== 'failed') return;
			clearInterval(poll);
			clearTimeout(slowTimer);
			// back to the page the update began on, now served by the new version
			if (state.state === 'done') return location.reload();
			phase = state.restore ? 'restore' : 'failed';
		}, POLL_MS);
	}

	// back to «Aktualisieren», where the update began (code review update-2 C-13)
	let line = $state<HTMLElement>();
	async function closeFailure() {
		phase = 'idle';
		await tick();
		line?.querySelector('button')?.focus();
	}

	// on «Sicherung einrichten», where every page leads without a Sicherung: to the Wiederherstellungscode
	function toBackupCode(event: MouseEvent) {
		const code = document.getElementById('backup-code-shown');
		if (!code) return;
		event.preventDefault();
		code.focus();
	}

	// what the line adds: the update's duration, the Sicherung first, or the one update by hand (Fachreview update-1)
	const DETAIL = {
		update: m.update_notice_duration,
		backup: m.update_notice_backup_needed,
		manual: m.update_notice_manual
	};
	const link = 'inline-flex min-h-12 items-center text-accent underline underline-offset-4';
</script>

{#if !hidden}
	<div
		class="flex flex-wrap items-center gap-x-4 gap-y-2 bg-accent-soft px-4 py-2 text-ink"
		data-testid="update-notice"
		bind:this={line}
	>
		<p>
			<strong>{m.update_notice_label()}:</strong>
			<span data-testid="update-notice-text"
				>{m.update_notice_available({ latest: notice.latest, current: notice.current })}
				{DETAIL[notice.variant]()}</span
			>
		</p>
		<a
			href={notice.releaseUrl}
			class={link}
			target="_blank"
			rel="noopener noreferrer"
			data-testid="update-notice-whats-new">{m.update_notice_whats_new()}</a
		>
		{#if notice.variant === 'backup'}
			<a
				href="/backup#backup-code-shown"
				class={link}
				onclick={toBackupCode}
				data-testid="update-notice-backup-link">{m.update_notice_backup_link()}</a
			>
		{:else if notice.variant === 'update'}
			<Button variant="secondary" onclick={() => (confirming = true)} testid="update-notice-update"
				>{m.update_notice_update()}</Button
			>
		{/if}
		<Button variant="ghost" onclick={later} testid="update-notice-later"
			>{m.update_notice_later()}</Button
		>
		{#if refusal}<p role="alert" class="w-full" data-testid="update-notice-refusal">
				{refusal}
			</p>{/if}
	</div>
{/if}

<Dialog
	bind:open={confirming}
	title={m.update_confirm_title()}
	confirmLabel={m.update_confirm_submit()}
	cancelLabel={m.update_confirm_cancel()}
	onconfirm={start}
	confirmTestid="update-confirm"
>
	<p>{m.update_confirm_text({ latest: notice.latest })}</p>
	<p data-testid="update-confirm-unsaved">{m.update_confirm_unsaved()}</p>
</Dialog>

{#if phase !== 'idle'}
	<UpdateProgress {phase} {step} {slow} {notice} {notStarted} onclose={closeFailure} />
{/if}
