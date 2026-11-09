/**
 * Wiederherstellung of an unsigned Sicherung (Decided (product owner) #1373): it goes on only when the operator types
 * WIEDERHERSTELLEN after the warning; any other answer or the end of the input refuses it.
 */
export const typedConfirmation =
	(ask: (question: string) => string | null = prompt, show = console.log) =>
	(warning: string) => {
		show(warning);
		return (
			ask('Tippen Sie WIEDERHERSTELLEN, um sie trotzdem wiederherzustellen:')?.trim() ===
			'WIEDERHERSTELLEN'
		);
	};
