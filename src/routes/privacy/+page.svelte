<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { formatDateLong } from '$lib/utils/format';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// A paragraph, with the privacy policy of the provider it names (DSG Art. 19)
	type Paragraph = { text: string; policy?: { provider: string; href: string } };

	const GOOGLE = { provider: 'Google', href: 'https://policies.google.com/privacy' };
	// What each sign-in provider learns, and its policy; only configured providers are named (#82)
	const signIn: Record<string, () => Paragraph> = {
		Google: () => ({ text: m.privacy_login_google(), policy: GOOGLE }),
		Microsoft: () => ({
			text: m.privacy_login_microsoft(),
			policy: { provider: 'Microsoft', href: 'https://privacy.microsoft.com/privacystatement' }
		})
	};

	// Who receives invoice data for the KI categorization (DSG Art. 19: recipient and country)
	const llmNotice = $derived(
		data.enabled === false
			? m.privacy_llm_off()
			: data.recipient
				? m.privacy_llm_external(data.recipient)
				: m.privacy_llm_local()
	);

	// The SMTP provider and its country when the operator set both (MAIL_PROVIDER_*, Art. 19 Abs. 4 DSG, #458)
	const smtpNotice = $derived(
		data.mailProvider
			? m.privacy_mail_smtp_provider({
					provider: data.mailProvider.name,
					country: data.mailProvider.country
				})
			: m.privacy_mail_smtp()
	);
	const mailNotice = $derived<Paragraph>(
		data.mail === 'resend'
			? {
					text: m.privacy_mail_resend(),
					policy: { provider: 'Resend', href: 'https://resend.com/legal/privacy-policy' }
				}
			: { text: data.mail === 'smtp' ? smtpNotice : m.privacy_mail_none() }
	);

	// JWT_EXPIRY in its largest whole unit, e.g. «7 Tage» or «12 Stunden»
	const lifetime = (seconds: number) => {
		const [unit, size] = (
			[
				['day', 86400],
				['hour', 3600],
				['minute', 60]
			] as const
		).find(([, size]) => seconds % size === 0) ?? ['second', 1];
		return new Intl.NumberFormat(getLocale(), { style: 'unit', unit, unitDisplay: 'long' }).format(
			seconds / size
		);
	};

	const operator = $derived(
		data.operator
			? m.privacy_controller_1({
					operator: [data.operator.name, data.operator.address].filter(Boolean).join(', ')
				}) + (data.operator.contact ? ` ${m.terms_contact({ contact: data.operator.contact })}` : '')
			: m.privacy_controller_none()
	);

	const sections = $derived<{ id: string; title: string; paragraphs: Paragraph[] }[]>([
		{
			id: 'controller',
			title: m.privacy_controller_title(),
			// The landlord for the recorded data, the operator for sign-in, server log and cookies (#458)
			paragraphs: [
				operator,
				m.privacy_controller_2(),
				m.privacy_controller_3(),
				m.privacy_controller_4()
			].map((text) => ({ text }))
		},
		{
			id: 'stored',
			title: m.privacy_stored_title(),
			paragraphs: [
				m.privacy_stored_1(),
				m.privacy_stored_2() +
					(data.serverCountry
						? ` ${m.privacy_stored_country({ country: data.serverCountry })}`
						: ''),
				m.audit_privacy()
			].map((text) => ({ text }))
		},
		{
			id: 'retention',
			title: m.privacy_retention_title(),
			paragraphs: [m.privacy_retention_1(), m.privacy_retention_2(), m.privacy_retention_3()].map(
				(text) => ({ text })
			)
		},
		{
			id: 'login',
			title: m.privacy_login_title(),
			paragraphs: [
				// #576: the Konto mit Passwort first; the provider sentence only with a provider (fach review 576 R-2)
				...(data.password
					? [{ text: m.privacy_login_local_1() }, { text: m.privacy_login_local_log() }]
					: []),
				...(data.providers.length
					? [
							{
								text: m.privacy_login_1({
									providers: new Intl.ListFormat(getLocale(), { type: 'disjunction' }).format(
										data.providers
									)
								})
							}
						]
					: []),
				...data.providers.flatMap((provider) => signIn[provider]?.() ?? []),
				{ text: m.privacy_login_log() }
			]
		},
		{
			id: 'third',
			title: m.privacy_third_title(),
			paragraphs: [
				mailNotice,
				{
					text: m.privacy_third_3(),
					policy: { provider: 'swisstopo', href: 'https://www.swisstopo.admin.ch/en/legal-framework' }
				},
				{ text: m.privacy_third_4(), policy: GOOGLE },
				// the local KI fetches a missing model from Ollama by itself (#577, fach review 577 R-2)
				...(llmNotice === m.privacy_llm_local() ? [{ text: m.privacy_third_ollama() }] : []),
				{ text: m.privacy_third_5() }
			]
		},
		{
			id: 'cookies',
			title: m.privacy_cookies_title(),
			paragraphs: [
				m.privacy_cookies_1(),
				m.privacy_cookies_2({ lifetime: lifetime(data.sessionSeconds) }),
				// only an installation with a provider sets the cookies of the OAuth flow (fach review 576 R-10)
				...(data.providers.length ? [m.privacy_cookies_3()] : []),
				m.privacy_cookies_4(),
				m.privacy_cookies_5()
			].map((text) => ({ text }))
		}
	]);
</script>

<svelte:head>
	<title>{m.privacy_title()} - Dwello</title>
</svelte:head>

<div class="flex max-w-3xl flex-col gap-8">
	<PageHeader title={m.privacy_title()} purpose={m.privacy_purpose()} />
	<!-- The day these texts last changed (#458) -->
	<p class="text-ink-muted" data-testid="legal-as-of">
		{m.legal_as_of({ date: formatDateLong('2026-10-20', { weekday: false }) })}
	</p>

	{#if data.demo}
		<Panel title={m.demo_notice_title()} testid="page-section">
			<p class="text-ink">{m.privacy_demo_1()}</p>
			<p class="text-ink">{m.audit_privacy_demo()}</p>
		</Panel>
	{/if}

	{#each sections as section (section.id)}
		<Panel id={section.id} title={section.title} testid="page-section">
			{#if section.id === 'third'}
				<p class="text-ink" data-testid="llm-recipient">{llmNotice}</p>
			{/if}
			{#each section.paragraphs as paragraph (paragraph.text)}
				<p class="text-ink">
					{paragraph.text}
					{#if paragraph.policy}
						<a
							href={paragraph.policy.href}
							rel="noopener noreferrer"
							class="text-accent underline underline-offset-4"
							>{m.privacy_policy_link({ provider: paragraph.policy.provider })}</a
						>
					{/if}
				</p>
			{/each}
			{#if section.id === 'stored'}
				<p class="text-ink" data-testid="draft-notice">{m.privacy_draft_notice()}</p>
			{/if}
		</Panel>
	{/each}
</div>
