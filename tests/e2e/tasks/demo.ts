import { Navigate } from '../screenplay/interactions';

// The instance of the E2E stack with DEMO=on (playwright.config.ts); the session cookies hold for every port of localhost
export const DEMO_INSTANCE = 'http://localhost:3104';

export const openDemoSignIn = Navigate.to(`${DEMO_INSTANCE}/login`);
export const openDemoOverview = Navigate.to(`${DEMO_INSTANCE}/dashboard`);
export const openDemoPrivacy = Navigate.to(`${DEMO_INSTANCE}/privacy`);
