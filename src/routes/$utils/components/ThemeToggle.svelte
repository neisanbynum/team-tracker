<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils/shadcn';
	import { useAppContext } from '../$state.svelte';
	import { Sun, Moon } from '@lucide/svelte';

	const app = useAppContext();

	const classname =
		'absolute top-1/2 left-1/2 aspect-square h-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-600';
</script>

<Button
	variant="secondary"
	size="icon"
	class="relative size-8 bg-transparent hover:bg-transparent"
	aria-label="Toggle Theme to {app.theme === 'light' ? 'Dark' : 'Light'}"
	onclick={app.toggletheme}
>
	<Sun class={cn('scale-100 rotate-0 dark:scale-0 dark:-rotate-90', classname)} />
	<Moon class={cn('scale-0 rotate-90 dark:scale-100 dark:rotate-0', classname)} />
</Button>
