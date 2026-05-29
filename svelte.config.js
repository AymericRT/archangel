import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({ runtime: 'nodejs22.x' }),
		prerender: {
			// Hash slugs like /#defense are intercepted client-side by HorizontalHeroPager
			// to drive the hero swiper; no matching DOM id exists, so skip the check.
			handleMissingId: ({ id }) => {
				if (['defense', 'infrastructure', 'investments', 'energy'].includes(id)) return;
				throw new Error(`Missing id: ${id}`);
			}
		}
	}
};

export default config;
