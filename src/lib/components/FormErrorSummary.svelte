<script lang="ts">
	import Icon from './Icon.svelte';

	interface FormError {
		field: string;
		message: string;
	}

	interface Props {
		errors: FormError[];
		title?: string;
	}

	let { errors, title = 'Bitte korrigieren Sie folgende Fehler:' }: Props = $props();

	function scrollToField(field: string) {
		const element = document.getElementById(field);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
			element.focus();
		}
	}
</script>

{#if errors.length > 0}
	<div
		class="bg-red-50 border border-red-200 rounded-lg p-4"
		role="alert"
		aria-labelledby="error-summary-title"
	>
		<div class="flex items-start gap-3">
			<Icon name="error" size={20} class="text-red-500 flex-shrink-0 mt-0.5" />
			<div class="flex-1">
				<h3 id="error-summary-title" class="text-sm font-medium text-red-800">
					{title}
				</h3>
				<ul class="mt-2 space-y-1">
					{#each errors as error}
						<li>
							<button
								type="button"
								onclick={() => scrollToField(error.field)}
								class="text-sm text-red-700 hover:text-red-900 hover:underline focus:outline-none focus:underline"
							>
								{error.message}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
{/if}
