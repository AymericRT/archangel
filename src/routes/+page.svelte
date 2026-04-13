<script lang="ts">
	import { onMount } from 'svelte';

	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/sections/Hero.svelte';
	import Statement from '$lib/components/sections/Statement.svelte';
	import Expertise from '$lib/components/sections/Expertise.svelte';
	import About from '$lib/components/sections/About.svelte';
	import CapabilitiesIntro from '$lib/components/sections/CapabilitiesIntro.svelte';
	import CapabilitiesDefense from '$lib/components/sections/CapabilitiesDefense.svelte';
	import CapabilitiesInfra from '$lib/components/sections/CapabilitiesInfra.svelte';
	import CapabilitiesInvestments from '$lib/components/sections/CapabilitiesInvestments.svelte';
	import CapabilitiesEnergy from '$lib/components/sections/CapabilitiesEnergy.svelte';
	import Ethos from '$lib/components/sections/Ethos.svelte';
	import Contact from '$lib/components/sections/Contact.svelte';
	import SiteFooter from '$lib/components/sections/SiteFooter.svelte';

	let scrollY = $state(0);
	let lastScrollY = 0;
	let navHidden = $state(false);
	let navOnDark = $state(false);
	let isLoaded = $state(false);

	onMount(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
			navHidden = scrollY > lastScrollY && scrollY > 80;
			lastScrollY = scrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		setTimeout(() => { isLoaded = true; }, 100);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<svelte:head>
	<title>Kleis Eschatos Group — Defense, Infrastructure, Investments, Energy</title>
	<meta name="description" content="Securing sovereignty, engineering resilience, powering the future. Kleis Eschatos Group delivers defense, infrastructure, investments, and energy solutions." />
	<meta property="og:title" content="Kleis Eschatos Group" />
	<meta property="og:description" content="Securing sovereignty, engineering resilience, powering the future. A multi-disciplinary industrial group bridging national security and sustainable development." />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/self_logo.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Kleis Eschatos Group" />
	<meta name="twitter:description" content="Securing sovereignty, engineering resilience, powering the future." />
</svelte:head>

<div class="relative">
	<Navbar {navHidden} {navOnDark} />

	<Hero {isLoaded} />

	<Statement />

	<Expertise />

	<About />

	<CapabilitiesIntro />
	<CapabilitiesDefense />
	<CapabilitiesInfra />
	<CapabilitiesInvestments />
	<CapabilitiesEnergy />

	<Ethos />

	<Contact />

	<SiteFooter />
</div>
