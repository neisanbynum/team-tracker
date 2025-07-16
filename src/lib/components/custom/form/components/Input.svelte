<!-- @component
	- Input field that utilizes context to update and display form state
	- Accepts properties of "form" and:
		* {name} - Name of the input field
		* {label} - Label of the input field		
		* {desc} - Description of the input field
		* {clearable} - Whether the input field is clearable
	- Usage:
		```html
			<FormInput
				name={"username"}
				label={"Username"}
				desc={"Enter your username"} 
				clearable 
			/>
		```
-->

<script lang="ts">
	import type { Prettier } from '$lib/utils/$types';
	import { Input, type InputProps, type InputType } from '$lib/components/ui/input';
	import { useFormContext } from '../utils/form-context.svelte';
	import { Stack } from '../../stack';
	import { cn } from '$lib/utils/shadcn';
	import { Label } from '$lib/components/ui/label';
	import FormDescription from './subcomponents/FormDescription.svelte';
	import FormErrorMessage from './subcomponents/FormErrorMessage.svelte';
	import { Eye, EyeClosed, X } from '@lucide/svelte';

	export type FormInputProperties = Prettier<
		Omit<InputProps, 'children' | 'value' | 'files' | 'type'> & {
			type?: InputType;
			label?: string;
			desc?: string;
			name: string;
			clearable?: boolean;
		}
	>;

	let { name, label, desc, type = 'text', clearable = false, ...rest }: FormInputProperties = $props();
	let id = $derived(`form-input-${name}`);

	let inputtype = $state<InputType>(type);
	const buttonclass = 'pointer-events-auto cursor-pointer aspect-square h-1/2';

	const passwordtoggle = () => {
		if (type !== 'password') return;
		inputtype = type === 'password' ? 'text' : 'password';
	};

	const form = useFormContext();
</script>

<Stack class={cn('h-fit w-48 items-start gap-1', rest.class)}>
	<Label class="pl-1" for={id}>{label}</Label>
	<Stack class="h-fit w-full p-1">
		<Input
			{...rest}
			{id}
			{name}
			type={inputtype}
			aria-errormessage="{name}-form-error"
			aria-describedby="{name}-form-description"
			value={form.values.get(name)}
			onchange={form.onchange(name)}
			onblur={form.onblur(name)}
			class="w-full"
		/>
		<Stack variant="hor-fit" class="absolute right-0 w-fit gap-1 p-1">
			<X class={cn(!clearable || !form.values.get(name) ? 'scale-0' : 'scale-100', buttonclass)} onclick={() => form.values.delete(name)} />
			<Eye
				class={cn(
					type !== 'password' || inputtype === 'password' ? 'scale-0' : 'scale-100',
					buttonclass
				)}
				onclick={passwordtoggle}
			/>
			<EyeClosed
				class={cn(
					type !== 'password' || inputtype !== 'password' ? 'scale-0' : 'scale-100',
					buttonclass
				)}
				onclick={passwordtoggle}
			/>
		</Stack>
	</Stack>
	<FormDescription {name} text={desc} />
	<FormErrorMessage {name} />
</Stack>
