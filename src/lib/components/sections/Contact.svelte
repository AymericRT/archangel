<script lang="ts">
	import { contact } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';

	let magneticBtn: HTMLElement;
	let btnX = $state(0);
	let btnY = $state(0);

	let formName = $state('');
	let formEmail = $state('');
	let formCompany = $state('');
	let formSubject = $state('');
	let formMessage = $state('');
	let formStatus = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');

	async function handleFormSubmit(e: SubmitEvent) {
		e.preventDefault();
		formStatus = 'sending';
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formName,
					email: formEmail,
					company: formCompany,
					subject: formSubject,
					message: formMessage
				})
			});
			if (!res.ok) throw new Error('Send failed');
			formStatus = 'sent';
			formName = '';
			formEmail = '';
			formCompany = '';
			formSubject = '';
			formMessage = '';
		} catch {
			formStatus = 'error';
		}
	}

	function handleMagneticMove(e: MouseEvent) {
		if (!magneticBtn) return;
		const rect = magneticBtn.getBoundingClientRect();
		const x = e.clientX - rect.left - rect.width / 2;
		const y = e.clientY - rect.top - rect.height / 2;
		btnX = x * 0.3;
		btnY = y * 0.3;
	}

	function handleMagneticLeave() {
		btnX = 0;
		btnY = 0;
	}

	const inputBase =
		'peer w-full bg-transparent pb-3 pt-6 text-base font-light text-slate-900 dark:text-neutral-50 outline-none transition-colors duration-300 placeholder:text-transparent border-b border-slate-200 dark:border-neutral-800 focus:border-slate-900 dark:focus:border-neutral-50';
	const labelBase =
		'pointer-events-none absolute left-0 top-6 text-base font-light text-slate-500 dark:text-neutral-500 transition-all duration-300 peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:text-[0.7rem] peer-not-placeholder-shown:tracking-[0.32em] peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:text-slate-500 peer-focus:-translate-y-5 peer-focus:text-[0.7rem] peer-focus:tracking-[0.32em] peer-focus:uppercase peer-focus:text-slate-900 dark:peer-focus:text-neutral-50';
</script>

<section id="contact" class="overflow-hidden">
	<div class="section section-rule mx-auto max-w-6xl px-8">
		<div class="mb-20 text-center" use:reveal>
			<p class="t-eyebrow mb-10">{contact.eyebrow}</p>
			<h2 class="t-section mb-3 text-slate-900 dark:text-neutral-50">
				{#each contact.headingTop as word, i}<span class="inline-block">{word}</span>{#if i < contact.headingTop.length - 1}{' '}{/if}{/each}
			</h2>
			<h2 class="t-section mb-12 text-slate-500 dark:text-neutral-500">
				{#each contact.headingBottom as word, i}<span class="inline-block">{word}</span>{#if i < contact.headingBottom.length - 1}{' '}{/if}{/each}
			</h2>
			<p class="t-lead mx-auto max-w-xl">
				{contact.body}
			</p>
		</div>

		<div class="mx-auto max-w-3xl" use:reveal={{ delay: 180 }}>
			<form onsubmit={handleFormSubmit} class="space-y-10">
				<div class="grid gap-10 md:grid-cols-2">
					<div class="relative">
						<input id="contact-name" type="text" bind:value={formName} required placeholder=" " class={inputBase} />
						<label for="contact-name" class={labelBase}>Full Name</label>
					</div>
					<div class="relative">
						<input id="contact-email" type="email" bind:value={formEmail} required placeholder=" " class={inputBase} />
						<label for="contact-email" class={labelBase}>Email Address</label>
					</div>
				</div>

				<div class="grid gap-10 md:grid-cols-2">
					<div class="relative">
						<input id="contact-company" type="text" bind:value={formCompany} placeholder=" " class={inputBase} />
						<label for="contact-company" class={labelBase}>Company / Organization</label>
					</div>
					<div class="relative">
						<input id="contact-subject" type="text" bind:value={formSubject} required placeholder=" " class={inputBase} />
						<label for="contact-subject" class={labelBase}>Subject</label>
					</div>
				</div>

				<div class="relative">
					<textarea id="contact-message" bind:value={formMessage} required rows="5" placeholder=" " class="{inputBase} resize-none"></textarea>
					<label for="contact-message" class={labelBase}>Your Message</label>
				</div>

				<div class="flex flex-col-reverse items-center gap-6 pt-6 md:flex-row md:justify-between">
					<p class="t-eyebrow">
						{#if formStatus === 'sent'}
							Message sent successfully.
						{:else if formStatus === 'error'}
							Something went wrong. Please try again.
						{/if}
					</p>
					<div
						bind:this={magneticBtn}
						class="relative inline-block"
						onmousemove={handleMagneticMove}
						onmouseleave={handleMagneticLeave}
						role="presentation"
					>
						<button
							type="submit"
							disabled={formStatus === 'sending'}
							class="magnetic-btn group relative inline-flex items-center justify-center overflow-hidden border border-slate-900 bg-slate-900 px-14 py-5 text-[11px] font-medium tracking-[0.32em] text-white uppercase transition-all duration-300 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-black dark:hover:bg-white"
							style="transform: translate({btnX}px, {btnY}px)"
						>
							<span class="relative z-10">
								{#if formStatus === 'sending'}
									Sending…
								{:else if formStatus === 'sent'}
									Sent
								{:else}
									Send Message
								{/if}
							</span>
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</section>
