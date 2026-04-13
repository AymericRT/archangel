// Subtle scroll-in fade. Pure IntersectionObserver, no library.
// Usage: <div use:reveal>...</div>
//        <div use:reveal={{ delay: 120 }}>...</div>
// Honors prefers-reduced-motion. Fires once per element.

type RevealOptions = {
	/** ms to delay before the fade begins */
	delay?: number;
	/** rootMargin for the observer (default '0px 0px -10% 0px') */
	rootMargin?: string;
	/** intersection threshold (default 0.05) */
	threshold?: number;
};

const reduceMotion =
	typeof window !== 'undefined' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let observer: IntersectionObserver | null = null;

function getObserver(rootMargin: string, threshold: number) {
	if (typeof window === 'undefined') return null;
	if (observer) return observer;
	observer = new IntersectionObserver(
		(entries, obs) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const el = entry.target as HTMLElement;
				const delay = Number(el.dataset.revealDelay ?? 0);
				if (delay > 0) {
					window.setTimeout(() => el.classList.add('is-revealed'), delay);
				} else {
					el.classList.add('is-revealed');
				}
				obs.unobserve(el);
			}
		},
		{ rootMargin, threshold }
	);
	return observer;
}

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
	const { delay = 0, rootMargin = '0px 0px -10% 0px', threshold = 0.05 } = options;

	if (reduceMotion) {
		node.classList.add('reveal', 'is-revealed');
		return {};
	}

	node.classList.add('reveal');
	if (delay) node.dataset.revealDelay = String(delay);

	const obs = getObserver(rootMargin, threshold);
	obs?.observe(node);

	return {
		destroy() {
			obs?.unobserve(node);
		}
	};
}
