<!-- @component
	- Container that stacks elements vertically or horizontally (defaults to vertical)
	- Accepts properties of "div"
	- Stack Variants: "ver", "ver-fit", "ver-full", "hor", "hor-fit", "hor-full"
	- Variant "ver" defaults to "ver-full"; Variant "hor" defaults to "hor-fit"
	- Usage: 
		```html
			<Stack variant="hor" class="h-12 gap-2">
				<Button>Button 1</Button>
				<Button>Button 2</Button>
				<Button>Button 3</Button>
			</Stack>
		```
-->

<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import type { StackProperties } from './$types';

	let { children, variant = 'ver-full', ...rest }: StackProperties = $props();

	let classname = $derived(
		cn(
			'flex w-full justify-center items-center gap-4 relative',
			variant.startsWith('hor') ? 'flex-row' : 'flex-col',
			(variant.endsWith('full') || variant === 'ver') && 'h-full',
			rest.class
		)
	);
</script>

<div {...rest} class={classname}>
	{#if children}
		{@render children()}
	{/if}
</div>
