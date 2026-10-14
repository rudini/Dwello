import { Navigate } from '../screenplay/interactions';

// The instance of the E2E stack with DEMO=on (playwright.config.ts); the session cookies hold for every port of localhost
export const DEMO_INSTANCE = 'http://localhost:3104';

export const openDemoPage = (path: string) => Navigate.to(DEMO_INSTANCE + path);
