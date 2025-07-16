/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodParseAsync } from '$lib/schemas/utils/parse.svelte';
import { JSONResponse, type JSONMethodReturn } from '$lib/utils/api';
import { getContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';
import type { ChangeEventHandler, FocusEventHandler } from 'svelte/elements';
import { SvelteMap } from 'svelte/reactivity';
import z from 'zod/v4';

export type WhenValidateForm = 'onchange' | 'onblur' | 'onsubmit';
export type FormMethod = 'GET' | 'POST';

export type FormInputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type FormSubmitEvent = SubmitEvent & {
	currentTarget: EventTarget & HTMLFormElement;
};

export type InitializeFormParams<Schema extends z.ZodObject> = {
	schema: Schema;
	initial: z.core.output<Schema>;
	whenvalidate?: WhenValidateForm;
	url: string;
	method?: FormMethod;
	onsuccess?: (response: JSONMethodReturn) => void;
};

export function initializeForm<Schema extends z.ZodObject>(params: InitializeFormParams<Schema>) {
	return params;
}

class FormContext<Schema extends z.ZodObject> {
	schema: Schema;
	whenvalidate: WhenValidateForm;
	url: string;
	method: FormMethod;
	onsuccess?: (response: JSONMethodReturn) => void;

	loading = $state<boolean>(false);

	values = new SvelteMap<keyof z.core.output<Schema>, any>();
	errors = new SvelteMap<keyof z.core.output<Schema>, string>();

	constructor(params: InitializeFormParams<Schema>) {
		this.schema = params.schema;
		this.whenvalidate = params.whenvalidate ?? 'onblur';
		this.url = params.url;
		this.method = params.method ?? 'POST';
		this.onsuccess = params.onsuccess;

		Object.entries(params.initial).forEach(([key, value]) => {
			this.values.set(key as keyof z.core.output<Schema>, value);
		});
	}

	#clearfielderror = (key: keyof z.core.output<Schema>) => () => this.errors.delete(key);

	#validatefield = async (key: keyof z.core.output<Schema>) => {
		const result = await zodParseAsync(Object.fromEntries(this.values), this.schema);
		if (!result.success && result.errors.has(key)) {
			this.errors.set(key, result.errors.get(key)!);
		}
	};

	#validateform = async () => {
		const result = await zodParseAsync(Object.fromEntries(this.values), this.schema);
		if (!result.success) {
			this.errors = result.errors;
		}

		return result;
	};

	onchange =
		(key: keyof z.core.output<Schema>): ChangeEventHandler<FormInputElement> =>
		(e) => {
			this.#clearfielderror(key);
			this.values.set(key, e.currentTarget.value);
			if (this.whenvalidate === 'onchange') {
				this.#validatefield(key);
			}
		};

	onblur =
		(key: keyof z.core.output<Schema>): FocusEventHandler<FormInputElement> =>
		() => {
			if (this.whenvalidate === 'onsubmit') return;
			this.#validatefield(key);
		};

	onsubmit = async (e: FormSubmitEvent) => {
		e.preventDefault();
		this.loading = true;

		const validate = await this.#validateform();
		if (!validate.success) {
			this.loading = false;
			return;
		}

		const request = await fetch(this.url, {
			method: this.method,
			body: JSON.stringify(validate.data),
			headers: {
				'Context-Type': 'application/json'
			}
		});
		const response = await JSONResponse(request);

		this.loading = false;

		if (!response.success) {
			toast.error(response.general);
			return;
		}

		if (this.onsuccess) {
			this.onsuccess(response);
		}
	};
}

const FormContextKey = 'form-context-key-sflkdjl';

export const setFormContext = <Schema extends z.ZodObject>(
	params: InitializeFormParams<Schema>
) => {
	return setContext<FormContext<Schema>>(FormContextKey, new FormContext(params));
};

export const useFormContext = <Schema extends z.ZodObject>() => {
	return getContext<FormContext<Schema>>(FormContextKey);
};
