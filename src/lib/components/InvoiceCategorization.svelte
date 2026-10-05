<script lang="ts">
	import type { Category } from '$lib/types';
	import Icon from './Icon.svelte';
	import Button from './Button.svelte';
	import CategoryBadge from './CategoryBadge.svelte';

	interface Props {
		isLoading?: boolean;
		suggestedCategory?: Category | null;
		confidence?: number;
		reasoning?: string;
		selectedCategoryId?: string;
		categories: Category[];
		overrideReason?: string;
		onCategoryChange?: (categoryId: string) => void;
		onOverrideReasonChange?: (reason: string) => void;
		showOverrideInput?: boolean;
	}

	let {
		isLoading = false,
		suggestedCategory = null,
		confidence = 0,
		reasoning = '',
		selectedCategoryId = '',
		categories,
		overrideReason = '',
		onCategoryChange,
		onOverrideReasonChange,
		showOverrideInput = false
	}: Props = $props();

	const isOverridden = $derived(
		suggestedCategory && selectedCategoryId && selectedCategoryId !== suggestedCategory.id
	);

	const confidenceColor = $derived.by(() => {
		if (confidence >= 0.8) return 'bg-green-500';
		if (confidence >= 0.6) return 'bg-amber-500';
		return 'bg-red-500';
	});

	const confidenceLabel = $derived.by(() => {
		if (confidence >= 0.8) return 'Hoch';
		if (confidence >= 0.6) return 'Mittel';
		return 'Niedrig';
	});

	function handleAcceptSuggestion() {
		if (suggestedCategory && onCategoryChange) {
			onCategoryChange(suggestedCategory.id);
		}
	}

	function handleCategorySelect(event: Event) {
		const target = event.target as HTMLSelectElement;
		if (onCategoryChange) {
			onCategoryChange(target.value);
		}
	}

	function handleReasonChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		if (onOverrideReasonChange) {
			onOverrideReasonChange(target.value);
		}
	}
</script>

<div class="space-y-4">
	<!-- Loading State -->
	{#if isLoading}
		<div class="p-6 bg-blue-50 border border-blue-200 rounded-lg">
			<div class="flex items-center gap-3">
				<Icon name="progress_activity" size={24} class="animate-spin text-blue-500" />
				<div>
					<p class="font-medium text-blue-900">KI-Kategorisierung läuft...</p>
					<p class="text-sm text-blue-600">Die Rechnung wird analysiert</p>
				</div>
			</div>
		</div>
	{:else if suggestedCategory}
		<!-- LLM Suggestion Card -->
		<div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
			<div class="flex items-start justify-between gap-4">
				<div class="flex-1">
					<div class="flex items-center gap-2 mb-2">
						<Icon name="auto_awesome" size={18} class="text-blue-500" />
						<span class="text-sm font-medium text-blue-900">KI-Vorschlag</span>
					</div>
					<div class="mb-3">
						<CategoryBadge category={suggestedCategory} size="md" />
					</div>

					<!-- Confidence Bar -->
					<div class="flex items-center gap-2 mb-2">
						<span class="text-xs text-gray-600">Konfidenz:</span>
						<div class="flex-1 max-w-[120px] bg-gray-200 rounded-full h-2">
							<div
								class="{confidenceColor} h-2 rounded-full transition-all"
								style="width: {confidence * 100}%"
							></div>
						</div>
						<span class="text-xs font-medium text-gray-700">
							{Math.round(confidence * 100)}% ({confidenceLabel})
						</span>
					</div>

					<!-- Reasoning -->
					{#if reasoning}
						<p class="text-sm text-gray-600 flex items-start gap-1.5">
							<Icon name="lightbulb" size={14} class="text-amber-500 flex-shrink-0 mt-0.5" />
							{reasoning}
						</p>
					{/if}
				</div>

				<!-- Accept Button -->
				{#if selectedCategoryId !== suggestedCategory.id}
					<Button variant="primary" size="sm" onclick={handleAcceptSuggestion}>
						<Icon name="check" size={16} />
						Übernehmen
					</Button>
				{:else}
					<div class="flex items-center gap-1 text-green-600 text-sm">
						<Icon name="check_circle" size={18} />
						Übernommen
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Manual Category Selection -->
	<div>
		<label for="category" class="block text-sm font-medium text-gray-700 mb-1">
			Kategorie {#if !suggestedCategory}<span class="text-red-500">*</span>{/if}
		</label>
		<select
			id="category"
			value={selectedCategoryId}
			onchange={handleCategorySelect}
			class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
		>
			<option value="">Kategorie auswählen...</option>
			<optgroup label="Umlagefähige Kosten">
				{#each categories.filter((c) => c.isAllowedUtilityCost) as category}
					<option value={category.id}>{category.name}</option>
				{/each}
			</optgroup>
			<optgroup label="Nicht umlagefähige Kosten">
				{#each categories.filter((c) => !c.isAllowedUtilityCost) as category}
					<option value={category.id}>{category.name}</option>
				{/each}
			</optgroup>
		</select>
	</div>

	<!-- Override Warning and Reason -->
	{#if isOverridden && showOverrideInput}
		<div class="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
			<div class="flex items-start gap-2">
				<Icon name="edit_note" size={18} class="text-amber-600 flex-shrink-0 mt-0.5" />
				<div>
					<p class="font-medium text-amber-800">KI-Vorschlag wird überschrieben</p>
					<p class="text-sm text-amber-700">
						Die ursprüngliche Kategorie war "{suggestedCategory?.name}". Bitte geben Sie einen Grund
						für die Änderung an.
					</p>
				</div>
			</div>
			<div>
				<label for="overrideReason" class="block text-sm font-medium text-amber-800 mb-1">
					Grund für Änderung <span class="text-red-500">*</span>
				</label>
				<textarea
					id="overrideReason"
					value={overrideReason}
					onchange={handleReasonChange}
					rows={2}
					placeholder="Warum wird die KI-Kategorisierung überschrieben?"
					class="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none bg-white"
				></textarea>
				<p class="mt-1 text-xs text-amber-600">
					Dieser Grund wird protokolliert und dient zur Verbesserung der KI-Kategorisierung.
				</p>
			</div>
		</div>
	{/if}
</div>
