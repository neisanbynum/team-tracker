<script>
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";

</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Button onclick={() => goto("/auth")} class="w-48">Sign In</Button>