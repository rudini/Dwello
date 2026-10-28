import type { Activity } from '../screenplay/actor';
import { CallTheMcp } from '../screenplay/abilities';
import { Click, Enter, Navigate } from '../screenplay/interactions';
import {
	accessKeyNameInput,
	accessKeysLink,
	closeNewAccessKey,
	confirmCreateAccessKey,
	confirmRevokeAccessKey,
	createAccessKeyButton,
	revokeAccessKeyButton
} from '../targets/access-keys';

export const MCP_ANSWER = 'mcp answer';

export const openAccessKeys = Click.on(accessKeysLink);
export const goToAccessKeys = Navigate.to('/config/access-keys');
export const createAccessKey = (name: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(createAccessKeyButton), Enter.theValue(name).into(accessKeyNameInput), Click.on(confirmCreateAccessKey));
export const closeTheNewAccessKey = Click.on(closeNewAccessKey);
export const startRevokingAccessKey = (name: string): Activity => (actor) =>
	actor.attemptsTo(goToAccessKeys, Click.on(revokeAccessKeyButton(name)));
export const confirmRevoking = Click.on(confirmRevokeAccessKey);

/** The AI program calls one tool of the MCP server with the key and remembers the answer */
export const callTool = (key: string, tool: string, args: object = {}): Activity => async (actor) =>
	actor.remember(MCP_ANSWER, await actor.abilityTo(CallTheMcp).call(key, 'tools/call', { name: tool, arguments: args }));
