<script lang="ts">
	import { useAppContext } from '../$state.svelte';
	import { Stack } from '$lib/components/custom/stack';
	import ThemeToggle from './ThemeToggle.svelte';

	const app = useAppContext();
</script>

<Stack variant="hor" class="h-12 justify-between border-b bg-slate-100 p-2 dark:bg-neutral-950">
	<h3 class="font-bold">{app.appheader}</h3>
	<Stack variant="hor" class="w-fit gap-2">
		<ThemeToggle />
	</Stack>
</Stack>
