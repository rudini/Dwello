import { readFileSync } from 'node:fs';

type JsonType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

interface Schema {
	type?: JsonType | JsonType[];
	enum?: unknown[];
	properties?: Record<string, Schema>;
	required?: string[];
	items?: Schema;
	minimum?: number;
	maximum?: number;
	exclusiveMinimum?: number;
	$ref?: string;
	$defs?: Record<string, Schema>;
}

export const loadSchema = (name: string): Schema =>
	JSON.parse(readFileSync(new URL(`../schema/${name}`, import.meta.url), 'utf8'));

const typeOf = (value: unknown): JsonType =>
	Array.isArray(value) ? 'array' : value === null ? 'null' : (typeof value as JsonType);

function rangeProblem(value: number, schema: Schema): string | undefined {
	if (schema.minimum !== undefined && value < schema.minimum) return `must be >= ${schema.minimum}`;
	if (schema.maximum !== undefined && value > schema.maximum) return `must be <= ${schema.maximum}`;
	if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) return `must be > ${schema.exclusiveMinimum}`;
	return undefined;
}

function typeProblem(value: unknown, schema: Schema, path: string): string | undefined {
	const types = schema.type === undefined ? [] : [schema.type].flat();
	if (types.length && !types.includes(typeOf(value))) return `${path} must be a ${types.join(' or ')}`;
	if (schema.enum && !schema.enum.includes(value)) return `${path} must be one of ${schema.enum.join(', ')}`;
	return undefined;
}

/**
 * Problems of `value` against the subset of JSON schema the shipped schemas use (type, enum, properties as a
 * closed set, required, items, ranges, local $ref); empty when valid.
 */
export function validate(value: unknown, schema: Schema, path = '', root: Schema = schema): string[] {
	if (schema.$ref) return validate(value, root.$defs![schema.$ref.replace('#/$defs/', '')], path, root);
	const at = path ? `${path}.` : '';
	const problem = typeProblem(value, schema, path);
	if (problem) return [problem];
	if (typeof value === 'number') return [rangeProblem(value, schema)].filter(Boolean).map((p) => `${path} ${p}`);
	if (Array.isArray(value) && schema.items) return value.flatMap((item, i) => validate(item, schema.items!, `${at}${i}`, root));
	if (typeOf(value) !== 'object' || !schema.properties) return [];
	const object = value as Record<string, unknown>;
	const missing = (schema.required ?? []).filter((key) => !(key in object)).map((key) => `${at}${key} is required`);
	const children = Object.entries(object).flatMap(([key, child]) => {
		const sub = schema.properties![key];
		return sub ? validate(child, sub, `${at}${key}`, root) : [`unknown key "${at}${key}"`];
	});
	return [...missing, ...children];
}
