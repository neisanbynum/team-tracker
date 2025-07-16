<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Stack } from '$lib/components/custom/stack';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { Heading } from '$lib/components/custom/typography';

	let { children } = $props();

	let register = $derived<boolean>(page.url.pathname === '/auth/register');
</script>


<Stack class="p-4 h-fit">
	<Card.Root class="w-124 max-w-full">
		<Card.Header>
			<Card.Title>{register ? 'Registration' : 'Authentication'}</Card.Title>
			<Card.Description>
				{register
					? "Create an account with the Army's Team Management Online"
					: "Sign in to access your team's management portal"}
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{@render children()}
		</Card.Content>
		<Card.Footer class="flex flex-row items-center justify-center gap-1">
			<p>{register ? 'Already have an account?' : 'Need to create an account?'}</p>
			<Button variant="link" onclick={() => goto(register ? '/auth' : 'auth/register')} class="p-0">
				{register ? 'Sign in' : 'Register'}
			</Button>
		</Card.Footer>
	</Card.Root>
</Stack>
