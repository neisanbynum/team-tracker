import { json } from '@sveltejs/kit';
import z from 'zod/v4';
import { status } from '$lib/utils/api/status';

export function APIResponse<Schema extends z.ZodObject>(
	success: false,
	code: number,
	general: string,
	schema?: Schema
): Response;
export function APIResponse<Schema extends z.ZodObject>(
	success: true,
	code: number,
	data: z.core.output<Schema>,
	schema?: Schema
): Response;
export function APIResponse<Schema extends z.ZodObject>(
	success: boolean,
	code: number,
	data: z.core.output<Schema> | string,
	schema?: Schema
): Response {
	if (!success) {
		return json(
			{
				general:
					typeof data === 'string'
						? data
						: 'Internal API Return Failure; Invalid Overload Data Type'
			},
			{ status: code }
		);
	}

	if (!schema) return json(data, { status: code });

	const validate = schema.safeParse(data);
	if (!validate) {
		return json(
			{ general: 'Invalid API Response Data Structure' },
			{ status: status.UNPROCESSABLE_ENTITY }
		);
	}

	return json(validate.data, { status: code });
}
