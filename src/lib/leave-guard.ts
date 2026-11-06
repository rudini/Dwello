/** A form with unsaved changes sets `ask`: «Abmelden» ends the session, so it asks first (#668, fallback review on #1150) */
export const leaveGuard: { ask?: () => Promise<boolean> } = {};
