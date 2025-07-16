import type { Component } from "$lib/utils/$types"

export type StackAxis = "hor" | "ver"
export type StackHeight = "full" | "fit"
export type StackVariant = StackAxis | `${StackAxis}-${StackHeight}`

export type StackProperties = Component<'div', {
	variant?: StackVariant
}>