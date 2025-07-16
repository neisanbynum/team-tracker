/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SvelteHTMLElements } from 'svelte/elements';


export type Prettier<T extends Record<string, unknown>> = { [key in keyof T]: T[key] } & {}
export type Extended<T extends Record<string, unknown>> = Prettier<T & { [key: string]: unknown }>

export type KeyValue<T extends Record<string, unknown>, K extends keyof T> = T[K]

export type SVHTMLProperties<T extends keyof SvelteHTMLElements> = SvelteHTMLElements[T];

// export interface Component<T extends keyof SvelteHTMLElements, P extends Record<string, any> = {}> {
// 	Standalone: Prettier<SVHTMLProperties<T> extends { children?: unknown } ? Omit<SVHTMLProperties<T>, 'children'> : SVHTMLProperties<T> & P>;
// 	Parent: Prettier<SVHTMLProperties<T> & P>;
// }
export type Component<T extends keyof SvelteHTMLElements, P extends Record<string, any> = {}> = Prettier<
	SVHTMLProperties<T> & P
>;

export type Size = 'sm' | 'md' | 'lg'
export type ExtendedSize = 'xs' | Size | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
