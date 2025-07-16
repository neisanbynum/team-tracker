<script lang="ts">
	import type { Component } from '$lib/utils/$types';
	import { cn } from '$lib/utils/shadcn';
	import { useFormContext } from '../../utils/form-context.svelte';

	export type DescriptionProperties = Component<'p', { name: string, text?: string }>;

	let { name, text, ...rest }: DescriptionProperties = $props();

	const form = useFormContext();
</script>

<p
	{...rest}
	id="{name}-form-description"
	data-slot="form-description"
	hidden={!text}
	class={cn('pl-1 text-xs', rest.class)}
>
	{text}
</p>
