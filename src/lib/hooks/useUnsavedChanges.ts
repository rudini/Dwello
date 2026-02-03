/**
 * Unsaved Changes Hook
 *
 * Warns users when they try to navigate away from a page with unsaved changes.
 */

import { beforeNavigate } from '$app/navigation';
import { onMount } from 'svelte';

interface UseUnsavedChangesOptions {
	/** Reactive getter function that returns whether there are unsaved changes */
	hasChanges: () => boolean;
	/** Message to show in the confirmation dialog */
	message?: string;
}

/**
 * Hook to prevent accidental navigation away from pages with unsaved changes.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useUnsavedChanges } from '$lib/hooks/useUnsavedChanges';
 *
 *   let formData = $state({ name: '' });
 *   let originalData = $state({ name: '' });
 *
 *   const hasChanges = $derived(JSON.stringify(formData) !== JSON.stringify(originalData));
 *
 *   useUnsavedChanges({
 *     hasChanges: () => hasChanges,
 *     message: 'Sie haben ungespeicherte Änderungen. Möchten Sie die Seite wirklich verlassen?'
 *   });
 * </script>
 * ```
 */
export function useUnsavedChanges(options: UseUnsavedChangesOptions): void {
	const {
		hasChanges,
		message = 'Sie haben ungespeicherte Änderungen. Möchten Sie die Seite wirklich verlassen?'
	} = options;

	// Handle browser beforeunload event (closing tab, refreshing)
	onMount(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasChanges()) {
				e.preventDefault();
				// Modern browsers ignore custom message, but it's still required
				e.returnValue = message;
				return message;
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	});

	// Handle SvelteKit navigation
	beforeNavigate(({ cancel }) => {
		if (hasChanges()) {
			// Using confirm for simplicity - in production, you might use a custom modal
			if (!confirm(message)) {
				cancel();
			}
		}
	});
}
