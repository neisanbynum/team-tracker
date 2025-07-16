/* eslint-disable @typescript-eslint/no-explicit-any */
import z from 'zod/v4';
import type { JSONMethodReturn } from '$lib/utils/api';
import { DODIDValidation, FullNameValidation, NameValidation, PasswordValidation, RankValidation, UsernameValidation } from '../utils/segments';

export const LoginFormSchema = z.object({
	username: z.coerce.string(),
	password: z.coerce.string()
});
export type ILoginFormSchema = typeof LoginFormSchema;
export type LoginFormShape = z.core.output<ILoginFormSchema>;

export const LoginResponse = z.object({
	name: z.string()
})
export type ILoginResponse = typeof LoginResponse
export type LoginResponseShape = z.core.output<ILoginResponse>;
export type LoginJSONResponse = JSONMethodReturn<ILoginResponse>;

export const RegisterFormSchema = z.object({
	dodid: DODIDValidation,
	dodidconfirm: DODIDValidation,
	rank: RankValidation.or(z.literal('')),
	last: NameValidation,
	first: NameValidation,
	middle: NameValidation.nullish(),
	prefermiddle: z.boolean(),
	password: PasswordValidation,
	passwordconfirm: PasswordValidation
}).refine(({ dodid, dodidconfirm }) => dodid === dodidconfirm, {
	error: "DoD IDs Does Not Match",
	path: ['dodidconfirm']
}).refine(({ password, passwordconfirm }) => password === passwordconfirm, {
	error: "Passwords Does Not Match",
	path: ['passwordconfirm']
})

export const RegisterAuthSchema = z.object({
	dodid: DODIDValidation,
	username: UsernameValidation,
	password: PasswordValidation
})

export const RegisterProfileSchema = z.object({
	dodid: DODIDValidation,
	rank: RankValidation,
	name: FullNameValidation
})
