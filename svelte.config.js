import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// experimental: {
		// 	remoteFunctions: true
		// },
		adapter: adapter(),
		alias: {
			custom: "$lib/components/custom"
		},
		files: {
			hooks: {
				client: "src/hooks/client",
				server: "src/hooks/server",
				universal: "src/hooks/universal"
			}
		}
	},
	// compilerOptions: {
	// 	experimental: { async: true }
	// }
};

export default config;
