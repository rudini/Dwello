<script lang="ts">
	import Icon from './Icon.svelte';
	import Button from './Button.svelte';

	type Variant = 'error' | 'warning' | 'info';

	interface Props {
		title?: string;
		message: string;
		variant?: Variant;
		retry?: () => void;
		retryText?: string;
		class?: string;
	}

	let {
		title = '',
		message,
		variant = 'error',
		retry,
		retryText = 'Erneut versuchen',
		class: className = ''
	}: Props = $props();

	const variantConfig: Record<
		Variant,
		{
			icon: string;
			bg: string;
			border: string;
			iconColor: string;
			titleColor: string;
			textColor: string;
		}
	> = {
		error: {
			icon: 'error',
			bg: 'bg-red-50',
			border: 'border-red-200',
			iconColor: 'text-red-600',
			titleColor: 'text-red-800',
			textColor: 'text-red-700'
		},
		warning: {
			icon: 'warning',
			bg: 'bg-amber-50',
			border: 'border-amber-200',
			iconColor: 'text-amber-600',
			titleColor: 'text-amber-800',
			textColor: 'text-amber-700'
		},
		info: {
			icon: 'info',
			bg: 'bg-blue-50',
			border: 'border-blue-200',
			iconColor: 'text-blue-600',
			titleColor: 'text-blue-800',
			textColor: 'text-blue-700'
		}
	};

	const config = $derived(variantConfig[variant]);
</script>

<div class="{config.bg} border {config.border} rounded-lg p-4 {className}">
	<div class="flex items-start gap-3">
		<Icon name={config.icon} size={20} class="{config.iconColor} mt-0.5 flex-shrink-0" />
		<div class="flex-1 min-w-0">
			{#if title}
				<p class="font-medium {config.titleColor}">{title}</p>
			{/if}
			<p class="text-sm {config.textColor} {title ? 'mt-1' : ''}">{message}</p>
			{#if retry}
				<div class="mt-3">
					<Button variant="secondary" size="sm" onclick={retry}>
						<Icon name="refresh" size={16} />
						{retryText}
					</Button>
				</div>
			{/if}
		</div>
	</div>
</div>
