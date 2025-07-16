<script lang="ts">
	import type { Component } from '$lib/utils/$types';
	import { cn } from '$lib/utils/shadcn';
	import { useFormContext } from '../../utils/form-context.svelte';

	export type ErrorMessageProperties = Component<'p', { name: string }>;

	let { name, ...rest }: ErrorMessageProperties = $props();

	const form = useFormContext();
</script>

<p
	{...rest}
	id="{name}-form-error"
	data-slot="form-error"
	hidden={!form.errors.has(name)}
	class={cn('text-destructive pl-1 text-xs font-semibold', rest.class)}
>
	{form.errors.get(name)}
</p>
