import { question } from '../screenplay/actor';
import { Count, Text, Visibility } from '../screenplay/questions';
import { MCP_ANSWER } from '../tasks/access-keys';
import { successToast } from '../targets/form';
import {
	accessKeyRows,
	createAccessKeyRefusal,
	newAccessKey,
	newAccessKeyHint,
	newAccessKeySecret,
	newAccessKeyValue,
	revokeAccessKeyMessage
} from '../targets/access-keys';

type McpAnswer = { status: number; body: { result?: { content: { text: string }[] } } | null };

export const newAccessKeyShown = Visibility.of(newAccessKey);
export const newAccessKeyNote = Text.of(newAccessKeyHint);
export const newAccessKeyText = Text.of(newAccessKeyValue);
export const accessKeyRow = (name: string) => Text.of(accessKeyRows(name));
export const accessKeyCount = (name: string) => Count.of(accessKeyRows(name));
export const revokeConsequence = Text.of(revokeAccessKeyMessage);

/** What the MCP server answered the AI program's last call: its status, and the text of a tool's result */
export const mcpStatus = question('the status of the MCP answer', (actor) => actor.recall<McpAnswer>(MCP_ANSWER).status);
export const mcpText = question('the text of the MCP answer', (actor) =>
	(actor.recall<McpAnswer>(MCP_ANSWER).body?.result?.content ?? []).map((part) => part.text).join('\n')
);
export const newAccessKeyWarning = Text.of(newAccessKeySecret);
export const createRefusal = Text.of(createAccessKeyRefusal);
export const doneMessage = Text.of(successToast);
