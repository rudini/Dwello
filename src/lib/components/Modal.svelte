<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import Button from './Button.svelte';

	type Variant = 'default' | 'danger' | 'warning';

	interface Props {
		open?: boolean;
		title: string;
		variant?: Variant;
		confirmText?: string;
		cancelText?: string;
		onconfirm?: () => void;
		oncancel?: () => void;
		onclose?: () => void;
		loading?: boolean;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		title,
		variant = 'default',
		confirmText = 'Bestätigen',
		cancelText = 'Abbrechen',
		onconfirm,
		oncancel,
		onclose,
		loading = false,
		children
	}: Props = $props();

	const variantConfig: Record<
		Variant,
		{ icon: string; iconClass: string; buttonVariant: 'primary' | 'danger' }
	> = {
		default: { icon: 'info', iconClass: 'text-primary bg-primary/10', buttonVariant: 'primary' },
		danger: { icon: 'warning', iconClass: 'text-red-600 bg-red-100', buttonVariant: 'danger' },
		warning: { icon: 'warning', iconClass: 'text-amber-600 bg-amber-100', buttonVariant: 'primary' }
	};

	function handleClose() {
		open = false;
		onclose?.();
	}

	function handleCancel() {
		open = false;
		oncancel?.();
	}

	function handleConfirm() {
		onconfirm?.();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleClose();
		}
	}

	// Focus trap implementation
	let modalElement = $state<HTMLElement | null>(null);
	let previousActiveElement: HTMLElement | null = null;

	$effect(() => {
		if (open && modalElement) {
			// Store previously focused element
			previousActiveElement = document.activeElement as HTMLElement;

			// Get all focusable elements within modal
			const focusableElements = modalElement.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			// Focus first element
			firstElement?.focus();

			// Handle tab key to trap focus
			const handleTabKey = (e: KeyboardEvent) => {
				if (e.key !== 'Tab') return;

				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement?.focus();
					}
				} else {
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement?.focus();
					}
				}
			};

			document.addEventListener('keydown', handleTabKey);
			return () => {
				document.removeEventListener('keydown', handleTabKey);
				// Return focus to previously focused element
				previousActiveElement?.focus();
			};
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		role="presentation"
		tabindex="-1"
	>
		<!-- Modal -->
		<div
			bind:this={modalElement}
			class="bg-white rounded-xl shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<!-- Header -->
			<div class="flex items-start gap-4 p-6 pb-4">
				<div
					class="flex-shrink-0 size-12 rounded-full flex items-center justify-center {variantConfig[
						variant
					].iconClass}"
				>
					<Icon name={variantConfig[variant].icon} size={24} />
				</div>
				<div class="flex-1 min-w-0">
					<h3 id="modal-title" class="text-lg font-semibold text-gray-900">{title}</h3>
					{#if children}
						<div class="mt-2 text-sm text-gray-600">
							{@render children()}
						</div>
					{/if}
				</div>
				<button
					onclick={handleClose}
					class="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors"
					aria-label="Schliessen"
				>
					<Icon name="close" size={20} class="text-gray-400" />
				</button>
			</div>

			<!-- Actions -->
			<div class="flex gap-3 p-6 pt-4 border-t border-gray-100">
				<Button variant="secondary" onclick={handleCancel} class="flex-1">
					{cancelText}
				</Button>
				<Button
					variant={variantConfig[variant].buttonVariant}
					onclick={handleConfirm}
					disabled={loading}
					class="flex-1"
				>
					{#if loading}
						<span class="animate-spin">
							<Icon name="refresh" size={18} />
						</span>
					{/if}
					{confirmText}
				</Button>
			</div>
		</div>
	</div>
{/if}
