import { SvelteMap } from 'svelte/reactivity';
import z from 'zod/v4';

type ZodParseReturn<Schema extends z.ZodObject> =
	| { success: true; data: z.core.output<Schema> }
	| { success: false; errors: SvelteMap<keyof z.core.output<Schema>, string> };

/**
 * Converts an array of Zod issues into a SvelteMap where the keys are the first path element
 * of each issue and the values are the corresponding error messages.
 *
 * @param issues An array of Zod issues to be processed.
 * @returns A SvelteMap where each key is a path from an issue and the value is the issue message.
 */
export function flattenZodIssues<Schema extends z.ZodObject>(
	issues: Array<z.core.$ZodIssue>
): SvelteMap<keyof z.core.output<Schema>, string> {
	const result = new SvelteMap<keyof z.core.output<Schema>, string>();
	issues.map((issue) => {
		const key = issue.path[0] as keyof z.core.output<Schema>;
		if (result.has(key)) return;

		result.set(key, issue.message);
	});

	return result;
}

/**
 * Parses the given data using the provided zod schema.
 *
 * @param data the data to be parsed
 * @param schema the zod schema to use for parsing
 * @returns an object with a `success` property indicating whether the parse was successful, and either a `data` property containing the parsed data or an `errors` property containing the errors that occurred during parsing.
 */
export function zodParse<Schema extends z.ZodObject>(
	data: unknown,
	schema: Schema
): ZodParseReturn<Schema> {
	const result = schema.safeParse(data);
	if (!result.success) {
		return { success: false, errors: flattenZodIssues(result.error.issues) };
	}

	return { success: true, data: result.data };
}

/**
 * Asynchronous version of `zodParse`.
 *
 * @param data the data to be parsed
 * @param schema the zod schema to use for parsing
 * @returns a Promise that resolves to an object with a `success` property indicating whether the parse was successful, and either a `data` property containing the parsed data or an `errors` property containing the errors that occurred during parsing.
 */
export async function zodParseAsync<Schema extends z.ZodObject>(
	data: unknown,
	schema: Schema
): Promise<ZodParseReturn<Schema>> {
	const result = await schema.safeParseAsync(data);
	if (!result.success) {
		return { success: false, errors: flattenZodIssues(result.error.issues) };
	}

	return { success: true, data: result.data };
}
