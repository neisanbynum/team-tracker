/* eslint-disable @typescript-eslint/no-explicit-any */
import z from 'zod/v4';
import { zodParseAsync } from '../utils/parse.svelte';

export const LoginFormSchema = z.object({
	username: z.coerce.string(),
	password: z.coerce.string()
});
export type ILoginFormSchema = typeof LoginFormSchema;
export type LoginFormShape = z.core.output<ILoginFormSchema>;

export const parseLoginForm = async (data: any) => await zodParseAsync(data, LoginFormSchema);
