<!-- @component
	- Form container that utilizes context to manage form state
	- Accepts properties of "form" and InitializeFormParams
	- Usage:
		```html
			<script lang="ts">
				import { z } from 'zod/v4';
				import { initializeFormContext } from '$lib/components/custom/form/utils/form-context.svelte';

				const schema = z.object({
					username: z.string(),
					password: z.string()
				})

				const form = initializeFormContext({
					schema,
					initial: {
						username: '',
						password: ''
					},
					whenvalidate: 'onblur',
					url: '/api/authenticate',
					method: 'POST',
					onsuccess: (response) => {
						if (!response.success) return

						// handle success
					}
				})
			</script>

			<Form {form}>
				<FormInput name={'username'} class="w-2/3" />
				<FormInput name={'password'} class="w-2/3" />
				<Button type="submit">Submit</Button>
			</Form>
-->

<script lang="ts" module>
	import z from 'zod/v4';
	import type { Component } from '$lib/utils/$types';
	import { setFormContext, type InitializeFormParams } from '../utils/form-context.svelte';
	import { cn } from '$lib/utils/shadcn';

	export type FormProperties<Schema extends z.ZodObject> = Component<
		'form',
		InitializeFormParams<Schema>
	>;
</script>

<script lang="ts">
	let {
		schema,
		initial,
		whenvalidate = 'onblur',
		url,
		method,
		onsuccess,
		children,
		...rest
	}: FormProperties<z.ZodObject> = $props()

	const form = setFormContext({ schema, initial, whenvalidate, url, method, onsuccess })
</script>

<form
	{...rest}
	onsubmit={form.onsubmit}
	class={cn('flex h-fit w-full flex-col items-center justify-center gap-6', rest.class)}
>
	{#if children}
		{@render children()}
	{/if}
</form>
