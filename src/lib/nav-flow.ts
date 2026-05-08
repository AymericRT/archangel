// Linear navigation order for the hero-pane horizontal flow.
// Used to compute slide direction for page transitions and to power
// the next/prev swipe gesture at the top of each page.

export const flow = [
	'/',
	'/capabilities/defense',
	'/capabilities/infrastructure',
	'/capabilities/investments',
	'/capabilities/energy'
] as const;

export type FlowRoute = (typeof flow)[number];

export function indexOf(path: string): number {
	return (flow as readonly string[]).indexOf(path);
}

export function next(path: string): string | null {
	const i = indexOf(path);
	return i >= 0 && i < flow.length - 1 ? flow[i + 1] : null;
}

export function prev(path: string): string | null {
	const i = indexOf(path);
	return i > 0 ? flow[i - 1] : null;
}

/** Returns 'forward' | 'back' | 'none' for transition direction between two paths. */
export function direction(from: string, to: string): 'forward' | 'back' | 'none' {
	const a = indexOf(from);
	const b = indexOf(to);
	if (a < 0 || b < 0) return 'none';
	if (b > a) return 'forward';
	if (b < a) return 'back';
	return 'none';
}
