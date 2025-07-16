<script lang="ts">
	import { goto } from '$app/navigation';
	import { Form, FormCheckbox, FormInput, initializeForm } from '$lib/components/custom/form';
	import { Stack } from '$lib/components/custom/stack';
	import { Button } from '$lib/components/ui/button';
	import { RegisterFormSchema, RegisterResponse } from '$lib/schemas/forms/authenticate';
	import { toast } from 'svelte-sonner';

	const form = initializeForm({
		schema: RegisterFormSchema,
		initial: {
			dodid: '',
			dodidconfirm: '',
			rank: '',
			last: '',
			first: '',
			middle: '',
			prefermiddle: false,
			password: '',
			passwordconfirm: ''
		},
		whenvalidate: 'onblur',
		url: '/$api/auth/register',
		method: 'POST',
		onsuccess: (data) => {
			console.log(data)
			const username = data.username
			if (!username) {
				toast.error('Error Creating Account; Contact Team Leader')
				return
			}

			toast.success(`Account Created; Username: ${username}`);
			goto("/auth")
		}
	});
</script>

<Form {...form} class="gap-4">
	<Stack variant="hor-fit" class="items-start gap-1">
		<FormInput required clearable name="dodid" label="DoD ID" class="w-full" type="number" />
		<FormInput
			required
			clearable
			name="dodidconfirm"
			label="Confirm DoD ID"
			class="w-full"
			type="number"
		/>
	</Stack>
	<Stack variant="ver-fit" class="items-end justify-start gap-1">
		<Stack variant="hor-fit" class="gap-1 items-start">
			<FormInput required clearable name="rank" label="Rank" class="w-1/3" />
			<FormInput required clearable name="last" label="Last Name" class="w-full" />
		</Stack>
		<Stack variant="hor-fit" class="items-start gap-1">
			<FormInput required clearable name="first" label="First Name" class="w-full" />
			<FormInput clearable name="middle" label="Middle Name" class="w-full" />
		</Stack>
		<FormCheckbox name="prefermiddle" label="Prefer Middle Name?" />
	</Stack>
	<Stack variant="hor-fit" class="items-start gap-1">
		<FormInput
			required
			clearable
			name={'password'}
			label="Password"
			class="w-full"
			type="password"
		/>
		<FormInput
			required
			clearable
			name={'passwordconfirm'}
			label="Confirm Password"
			class="w-full"
			type="password"
		/>
	</Stack>
	<Button type="submit" class="w-3/5">Authenticate</Button>
</Form>
