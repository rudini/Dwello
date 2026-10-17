import { Navigate } from '../screenplay/interactions';

// The instance of the E2E stack with DEMO=on (playwright.config.ts); the session cookies hold for every port of localhost.
// It starts only for the features playwright.config.ts names in `usesExtraInstances`: a new feature using it goes there
export const DEMO_INSTANCE = 'http://localhost:3104';

export const openDemoSignIn = Navigate.to(`${DEMO_INSTANCE}/login`);
export const openDemoOverview = Navigate.to(`${DEMO_INSTANCE}/dashboard`);
export const openDemoPrivacy = Navigate.to(`${DEMO_INSTANCE}/privacy`);
export const openDemoTerms = Navigate.to(`${DEMO_INSTANCE}/terms`);
