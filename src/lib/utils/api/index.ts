import z from 'zod/v4';
import { status } from './status';
import { zodParseAsync } from '$lib/schemas/utils/parse.svelte';
import { json } from '@sveltejs/kit';

export const JSONResponseValidation = z.discriminatedUnion('success', [
	z.object({
		success: z.literal(false),
		status: z
			.number()
			.int()
			.positive()
			.refine((val) => val < 200 || 300 <= val, { error: 'Invalid Error Status Code' }),
		general: z.string()
	}),
	z.object({
		success: z.literal(true),
		status: z
			.number()
			.int()
			.positive()
			.refine((val) => 200 <= val || val < 300, { error: 'Invalid Error Status Code' }),
		data: z.record(z.string(), z.any())
	})
]);

export type JSONMethodReturn<Schema extends z.ZodObject = z.ZodObject> =
	| { success: true; status: number; data: z.core.output<Schema> }
	| { success: false; status: number; general: string };

export async function JSONRequest<Schema extends z.ZodObject>(
	request: Request,
	schema: Schema
): Promise<JSONMethodReturn<Schema>> {
	if (!request.body) {
		return { success: false, status: status.BAD_REQUEST, general: 'No Request Body' };
	}

	const data = (await request.body.getReader().read()).value;
	if (!data) {
		return { success: false, status: status.BAD_REQUEST, general: 'No Request Data' };
	}

	console.log({ JSONRequestData: JSON.parse(new TextDecoder('utf-8').decode(data)) });

	const parse = await zodParseAsync(JSON.parse(new TextDecoder('utf-8').decode(data)), schema);
	if (!parse.success) {
		console.warn(parse.errors);
		return { success: false, status: status.UNPROCESSABLE_ENTITY, general: 'Invalid Request Data' };
	}

	return { success: true, status: status.OK, data: parse.data };
}

export const FailedMethodData = z.object({ general: z.string() });

export async function JSONResponse<Schema extends z.ZodObject>(
	response: Response,
	schema?: Schema
): Promise<JSONMethodReturn<Schema>> {
	if (!response.body) {
		return { success: false, status: status.NOT_ACCEPTABLE, general: 'No Response Body' };
	}

	const dataStream = (await response.body.getReader().read()).value;
	if (!dataStream) {
		return { success: false, status: status.NOT_ACCEPTABLE, general: 'No Response Data' };
	}

	const data = JSON.parse(new TextDecoder('utf-8').decode(dataStream));

	if (!schema) {
		if (200 > response.status || response.status > 299) {
			const validate = await FailedMethodData.safeParseAsync(data);
			return {
				success: false,
				status: response.status,
				general: validate.success ? validate.data.general : 'Invalid Response Data Structure'
			};
		}

		return { success: true, status: response.status, data };
	}

	const parse = await zodParseAsync(data, schema);
	if (!parse.success) {
		console.error({ parseerrors: parse.errors });
		return {
			success: false,
			status: status.UNPROCESSABLE_ENTITY,
			general: 'Invalid Response Data Structure'
		};
	}

	return { success: true, status: response.status, data: parse.data };
}

export async function resolveAPI<Schema extends z.ZodObject>(
	response: JSONMethodReturn<Schema>,
	schema?: Schema
) {
	if (!response.success || response.status >= 300) {
		return json(
			{ general: !response.success ? response.general : 'Invalid Status Code' },
			{ status: response.status >= 300 ? response.status : status.INTERNAL_SERVER_ERROR }
		);
	}

	if (!schema) return json(response.data, { status: response.status });

	const validate = await schema.safeParseAsync(response.data);
	if (!validate) {
		return json(
			{ general: 'Invalid API Response Data Structure' },
			{ status: status.UNPROCESSABLE_ENTITY }
		);
	}

	return json(validate.data, { status: response.status });
}
