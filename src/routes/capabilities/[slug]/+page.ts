import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

const valid = ['defense', 'infrastructure', 'investments', 'energy'] as const;
type Slug = (typeof valid)[number];

export const entries: EntryGenerator = () => valid.map((slug) => ({ slug }));

const meta: Record<Slug, { title: string; description: string }> = {
	defense: {
		title: 'Defense & Security — Kleis Eschatos Group',
		description:
			'Comprehensive turnkey defense and homeland security solutions: cyber intelligence, surveillance, tactical response, modernization, optics, and software engineering.'
	},
	infrastructure: {
		title: 'Sustainable Infrastructure & Engineering — Kleis Eschatos Group',
		description:
			'Resilient, future-ready infrastructure: engineering ecosystems and precision mechanical services for large-scale industrial projects.'
	},
	investments: {
		title: 'Strategic Investments — Kleis Eschatos Group',
		description:
			'Capital with a conscience: industrial localization, systemic transformation, and strategic partnerships driving long-term, responsible returns.'
	},
	energy: {
		title: 'Energy & Mining — Kleis Eschatos Group',
		description:
			'New power for a new era: turbine and engine overhaul, water security, and future-energy systems supporting reliability and the sustainable transition.'
	}
};

export const load: PageLoad = ({ params }) => {
	if (!(valid as readonly string[]).includes(params.slug)) throw error(404, 'Not found');
	const slug = params.slug as Slug;
	return { slug, ...meta[slug] };
};
