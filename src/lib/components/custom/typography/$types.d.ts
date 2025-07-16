/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Component, ExtendedSize } from '$lib/utils/$types';
import type { SvelteHTMLElements } from 'svelte/elements';

type TypographyComponent<T extends keyof SvelteHTMLElements, P extends Record<string, any> = {}> = Omit<Component<T, P & { variant: T, text?: string }>, 'children'>;

export type FontSize = Exclude<ExtendedSize, 'md'> | 'base'
export type HeadingElement = keyof Pick<SvelteHTMLElements, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>
export type TextProperties<
	T extends keyof SvelteHTMLElements,
	P extends Record<string, any> = {}
> = Component<T, P & { size?: FontSize; text?: string }>;

export type HeadingProperties = TextProperties<'h1', { variant?: HeadingElement }>
;
// export type HeadingProperties<T extends HeadingElement, P extends Record<string, any> = {}> = TypographyComponent<T, P>;
