<script lang="ts">
	import '../app.css';
	import { setAppContext } from './$utils/$state.svelte';
	import { Stack } from '$lib/components/custom/stack';
	import Appbar from './$utils/components/Appbar.svelte';

	let { children } = $props();

	setAppContext();
</script>

<Stack class="h-screen w-screen gap-0">
	<Appbar />
	<Stack>{@render children()}</Stack>
</Stack>
