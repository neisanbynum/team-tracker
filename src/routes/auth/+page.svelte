<script lang="ts">
	import { Form, FormInput, initializeForm } from '$lib/components/custom/form';
	import { Stack } from '$lib/components/custom/stack';
	import { Button } from '$lib/components/ui/button';
	import { LoginFormSchema } from '$lib/schemas/forms/authenticate';
	import { toast } from 'svelte-sonner';

	const form = initializeForm({
		schema: LoginFormSchema,
		initial: {
			username: '',
			password: ''
		},
		whenvalidate: 'onsubmit',
		url: '/$api/auth/login',
		method: 'POST',
		onsuccess: (data) => {
			const shortrankname = data.shortrankname;
			if (!shortrankname) {
				toast.error("Error Logging In; Contact Team Leader");
			}

			console.log(data)
			toast.success(`Welcome, ${shortrankname}`);
		}
	});
</script>

<Form {...form} class="gap-4">
	<Stack variant="ver-fit" class="gap-1">
		<FormInput required clearable name={'username'} label="Username" class="w-4/5" />
		<FormInput required clearable name={'password'} label="Password" class="w-4/5" type="password" />
	</Stack>
	<Button type="submit" class="w-3/5">Authenticate</Button>
</Form>
