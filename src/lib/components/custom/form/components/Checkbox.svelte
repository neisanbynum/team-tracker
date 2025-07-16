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
				class="w-2/3"
			/>
		```
-->

<script lang="ts">
	import type { Prettier } from '$lib/utils/$types';
	import { Checkbox, type CheckboxProps } from "$lib/components/ui/checkbox";
	import { Input, type InputProps, type InputType } from '$lib/components/ui/input';
	import { useFormContext } from '../utils/form-context.svelte';
	import { Stack } from '../../stack';
	import { cn } from '$lib/utils/shadcn';
	import { Label } from '$lib/components/ui/label';
	import FormDescription from './subcomponents/FormDescription.svelte';
	import FormErrorMessage from './subcomponents/FormErrorMessage.svelte';

	export type FormCheckboxProperties = Prettier<
		Omit<CheckboxProps, "name"> & {
			label?: string;
			desc?: string;
			name: string;
		}
	>;

	let {
		name,
		label,
		desc,
		class: classname,
		...rest
	}: FormCheckboxProperties = $props();
	let id = $derived(`form-checkbox-${name}`);

	const form = useFormContext();
</script>

<Stack class={cn('h-fit w-fit items-start gap-1', classname)}>
	<Stack class="flex-row h-fit w-fit gap-1">
		<Checkbox {...rest} {name} checked={form.values.get(name)} onCheckedChange={(val) => form.values.set(name, val)} />
		<Label class="pl-1" for={id}>{label}</Label>
	</Stack>
	<FormDescription {name} text={desc} />
	<FormErrorMessage {name} />
</Stack>
