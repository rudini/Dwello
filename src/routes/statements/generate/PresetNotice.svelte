<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import { formatDate } from '$lib/utils/format';

	// What the link that opened the wizard chose, and where the settings come from (A-10, personas K1)
	let {
		preset,
		step
	}: {
		preset?: {
			building: string;
			start: string;
			end: string;
			fromStatements: boolean;
			feeFromSettings: boolean; // no other statement at the run's rate (#89)
			differing?: boolean; // the other statements are set differently: both from the settings (#119)
			profileFromApartment?: boolean; // then the Heizprofil of the same apartment's statement (#387)
		} | null;
		step: number; // said on the settings step, where the link opens the wizard
	} = $props();

	function notice(p: NonNullable<typeof preset>) {
		if (p.profileFromApartment) return m.statements_preset_profile_from_apartment();
		if (p.differing) return m.statements_preset_differing();
		if (!p.fromStatements) return m.statements_preset_from_settings();
		return p.feeFromSettings
			? m.statements_preset_profile_from_statements()
			: m.statements_preset_from_statements();
	}
</script>

{#if preset && step === 3}
	<Alert
		tone="info"
		title={m.statements_preset_title({
			building: preset.building,
			period: `${formatDate(preset.start)} – ${formatDate(preset.end)}`
		})}
		testid="wizard-preset"
	>
		<p>
			{notice(preset)}
		</p>
	</Alert>
{/if}
