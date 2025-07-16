<script lang="ts">
	import { cn } from "$lib/utils/shadcn";
	import type { HeadingProperties } from "./$types";

	let { variant = 'h1', size = 'xl', text, ...rest }: HeadingProperties = $props();
	let fontsize = $derived(`text-${size}`)

</script>

<p
	{...rest}
	class={cn(fontsize, ['xs', 'sm', 'base', 'lg', 'xl'].includes(size) ? 'font-semibold' : 'font-bold', rest.class)}
>
	{#if text}
		{text}
	{/if}
</p>