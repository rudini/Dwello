// $app/state as a test sets it: the address and a pending navigation change while the component stays mounted
export const page = $state({ url: new URL('http://localhost/') });
export const navigating = $state<{ to: object | null }>({ to: null });
