import { readFileSync } from 'node:fs';

interface Schema {
	type?: 'object' | 'array' | 'string' | 'number' | 'boolean';
	properties?: Record<string, Schema>;
	required?: string[];
	items?: Schema;
	minimum?: number;
	maximum?: number;
	exclusiveMinimum?: number;
}

export const loadSchema = (name: string): Schema =>
	JSON.parse(readFileSync(new URL(`../schema/${name}`, import.meta.url), 'utf8'));

const typeOf = (value: unknown) => (Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value);

function rangeProblem(value: number, schema: Schema): string | undefined {
	if (schema.minimum !== undefined && value < schema.minimum) return `must be >= ${schema.minimum}`;
	if (schema.maximum !== undefined && value > schema.maximum) return `must be <= ${schema.maximum}`;
	if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) return `must be > ${schema.exclusiveMinimum}`;
	return undefined;
}

function objectProblems(value: object, schema: Schema, at: string): string[] {
	const missing = (schema.required ?? []).filter((key) => !(key in value)).map((key) => `${at}${key} is required`);
	const children = Object.entries(value).flatMap(([key, child]) => {
		const sub = schema.properties?.[key];
		return sub ? validate(child, sub, `${at}${key}`) : [`unknown key "${at}${key}"`];
	});
	return [...missing, ...children];
}

/** Problems of `value` against the subset of JSON schema the shipped schemas use; empty when valid. */
export function validate(value: unknown, schema: Schema, path = ''): string[] {
	const at = path ? `${path}.` : '';
	if (schema.type && typeOf(value) !== schema.type) return [`${path} must be a ${schema.type}`];
	if (typeof value === 'number') return [rangeProblem(value, schema)].filter(Boolean).map((p) => `${path} ${p}`);
	if (Array.isArray(value) && schema.items) return value.flatMap((item, i) => validate(item, schema.items!, `${at}${i}`));
	if (typeOf(value) === 'object' && schema.properties) return objectProblems(value as object, schema, at);
	return [];
}
