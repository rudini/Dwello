// The DOM tests' browser prefers Swiss German, like the E2E browser (playwright.config.ts, locale)
Object.defineProperty(navigator, 'languages', { value: ['de-CH', 'de'] });
