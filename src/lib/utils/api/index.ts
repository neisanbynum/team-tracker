import z from 'zod/v4';
import { status } from './status';
import { zodParseAsync } from '$lib/schemas/utils/parse.svelte';

export type JSONMethodReturn<Schema extends z.ZodObject = z.ZodObject> = { success: true; status: number; data: z.core.output<Schema> }
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

	const parse = await zodParseAsync(JSON.parse(new TextDecoder('utf-8').decode(data)), schema);
	if (!parse.success) {
		console.warn(parse.errors);
		return { success: false, status: status.UNPROCESSABLE_ENTITY, general: 'Invalid Request Data' };
	}

	return { success: true, status: status.OK, data: parse.data };
}

export async function JSONResponse<Schema extends z.ZodObject>(
	response: Response,
	schema?: Schema
): Promise<JSONMethodReturn<Schema>> {
	if (!response.body) {
		return { success: false, status: status.NOT_ACCEPTABLE, general: 'No Response Body' };
	}

	const data = (await response.body.getReader().read()).value;
	if (!data) {
		return { success: false, status: status.NOT_ACCEPTABLE, general: 'No Response Data' };
	}

	if (!schema) {
		return {
			success: true,
			status: response.status,
			data: JSON.parse(new TextDecoder('utf-8').decode(data))
		};
	}

	const parse = await zodParseAsync(JSON.parse(new TextDecoder('utf-8').decode(data)), schema);
	if (!parse.success) {
		console.warn(parse.errors);
		return {
			success: false,
			status: status.UNPROCESSABLE_ENTITY,
			general: 'Invalid Response Data'
		};
	}

	return { success: true, status: response.status, data: parse.data };
}
