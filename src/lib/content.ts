// Site content — keep copy edits in one place. Markup lives in the components
// under `src/lib/components/sections/`.

export type Item = { title: string; desc: string };

export const hero = {
	brand: 'Kleis Eschatos Group',
	tagline: 'Securing Sovereignty. Engineering Resilience. Powering the Future.',
	est: 'EST. 2009'
};

export const statement = {
	lines: ['Strategic Defense.', 'Resilient Infrastructure.', 'Ethical Capital.'],
	body:
		'We are a multi-disciplinary industrial group bridging the gap between national security and sustainable development. Integrating over a decade of specialized engineering expertise with a philosophy of long-term stewardship, we build the systems that protect and empower nations.'
};

export const expertise: Item[] = [
	{ title: 'Defense Technology', desc: 'Advanced security and intelligence solutions.' },
	{ title: 'Infrastructure', desc: 'Future-ready systems built to endure.' },
	{ title: 'Investments', desc: 'Capital aligned with purpose and industrial growth.' },
	{ title: 'Energy & Mining', desc: 'Power generation and sustainable transition solutions.' }
];

export const about = {
	heading: 'About Us',
	panels: [
		{
			eyebrow: null,
			heading: 'A Heritage of Precision,\nA Future of Purpose.',
			body:
				'Kleis Eschatos Group was established over 15 years ago to provide government agencies with bespoke, specialized procurement and support services. We have since evolved into a comprehensive group covering defense technologies, manufacturing, and strategic investment.'
		},
		{
			eyebrow: 'Our Philosophy',
			heading: 'Stewardship Over\nSpeculation.',
			body:
				'We go beyond the traditional role of a contractor. We believe in stewardship — acting as long-term stakeholders rather than passive advisors. Our approach blends strategic foresight with disciplined capital, ensuring that every project we deliver harmonizes economic growth with social responsibility and national stability.'
		}
	]
};

export const capabilities = {
	intro: { heading: 'Our Capabilities' },
	defense: {
		heading: 'Defense & Security',
		lead:
			'Comprehensive protection for a complex world. We act as a leading turnkey solution provider, integrating various technologies for homeland security and special forces.',
		items: [
			{ title: 'Cyber Intelligence', desc: 'Solutions for data protection and intelligence gathering to combat digital threats.' },
			{ title: 'Surveillance Systems', desc: 'Integrated "Air-Ground" supervision capabilities to detect and track activity across borders and critical assets.' },
			{ title: 'Tactical Response', desc: 'Full-spectrum CBRNE (Chemical, Biological, Radiological, Nuclear, Explosive) detection vehicles and specialized riot control systems.' },
			{ title: 'Modernization', desc: 'Retrofitting and upgrading critical defense platforms, including armored vehicles and air defense units, to extend operational relevance.' },
			{ title: 'Optics & Vision', desc: 'Supply of advanced night vision systems and "future-proof" optical gear.' },
			{ title: 'Software Engineering', desc: 'Full-lifecycle development—from design to implementation—creating secure, reliable systems for mission-critical operations.' }
		] as Item[]
	},
	infra: {
		headingMain: 'Sustainable Infrastructure',
		headingAccent: '& Engineering',
		lead:
			'Building systems that endure. We advise governments and investors on resilient, future-ready infrastructure that balances economic growth with responsibility.',
		items: [
			{ title: 'Resilient Engineering', desc: 'Design and development of infrastructure ecosystems capable of withstanding environmental and operational challenges.' },
			{ title: 'Mechanical Services', desc: 'Precision fabrication, manufacturing, and assembly of complex components for large-scale industrial projects.' }
		] as Item[]
	},
	investments: {
		heading: 'Strategic Investments',
		lead:
			'Capital with a conscience. We channel capital toward long-term, responsible returns through public-private partnerships and governance-driven ventures.',
		items: [
			{ title: 'Industrial Localization', desc: 'We invest directly in establishing local manufacturing facilities to ensure supply chain security and technology transfer.' },
			{ title: 'Systemic Transformation', desc: 'Partnering with visionary enterprises to turn transformation into sustainable performance, aligning profitability with national purpose.' },
			{ title: 'Strategic Partnerships', desc: 'Securing selective representation and building strong relationships with global business partners to bring world-class technologies to the local market.' }
		] as Item[]
	},
	energy: {
		heading: 'Energy & Mining',
		lead:
			'New power for a new era. We are dedicated to maintaining energy reliability while supporting the transition toward sustainable sources.',
		items: [
			{ title: 'Power Generation', desc: 'Comprehensive overhaul, maintenance, and parts supply for industrial turbines and power plants.' },
			{ title: 'Heavy Engine Optimization', desc: 'Expert overhaul services for high-capacity engines used in the energy and logistics sectors.' },
			{ title: 'Water Security', desc: 'Next-generation mobile desalination and purification systems ensuring water access for institutions and remote operations.' },
			{ title: 'Future Energy', desc: 'Implementing advanced technologies to support the shift toward cleaner, more efficient energy grids.' }
		] as Item[]
	}
};

export const ethos = {
	heading: 'Our Ethos',
	items: [
		{ title: 'Foresight', desc: 'We stay up-to-date with global technological advancements to identify new products and solutions for the market.' },
		{ title: 'Balance', desc: 'We harmonize growth with responsibility, ensuring our work serves both shareholders and society.' },
		{ title: 'Commitment', desc: 'We do not just advise; we invest, align, and commit to the success of our partners.' }
	] as Item[]
};

export const contact = {
	eyebrow: 'Contact Us',
	headingTop: ['Let\u2019s', 'build', 'something'],
	headingBottom: ['that', 'lasts.'],
	body: 'Ready to discuss how we can support your strategic objectives? Get in touch with our team.'
};

export const footer = {
	brand: 'Kleis Eschatos Group',
	copyright: '\u00A9 2024 Kleis Eschatos Group'
};

export const nav = {
	links: [
		{ label: 'About', href: '#about' },
		{ label: 'Capabilities', href: '#capabilities' },
		{ label: 'Investments', href: '#cap-investments' },
		{ label: 'Ethos', href: '#ethos' },
		{ label: 'Contact', href: '#contact' }
	]
};
