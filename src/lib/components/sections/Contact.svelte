<script lang="ts">
	import { contact } from '$lib/content';

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
</script>

<section id="contact" class="overflow-hidden">
	<div class="mx-auto max-w-6xl border-t border-slate-200 dark:border-slate-800 px-8 py-24 md:py-32">
		<div class="mb-20 text-center">
			<p class="mb-10 text-base font-light tracking-[0.4em] text-slate-500 dark:text-slate-300 uppercase md:text-lg">{contact.eyebrow}</p>
			<h2 class="mb-6 text-4xl font-extralight leading-[1.1] text-slate-800 dark:text-slate-100 md:text-5xl lg:text-6xl">
				{#each contact.headingTop as word, i}<span class="inline-block">{word}</span>{#if i < contact.headingTop.length - 1}{' '}{/if}{/each}
			</h2>
			<h2 class="mb-16 text-4xl font-extralight leading-[1.1] text-slate-500 dark:text-slate-300 md:text-5xl lg:text-6xl">
				{#each contact.headingBottom as word, i}<span class="inline-block">{word}</span>{#if i < contact.headingBottom.length - 1}{' '}{/if}{/each}
			</h2>
			<p class="mx-auto max-w-xl text-lg font-light leading-relaxed text-slate-500 dark:text-slate-300 md:text-xl">
				{contact.body}
			</p>
		</div>

		<div class="mx-auto max-w-3xl">
			<form onsubmit={handleFormSubmit} class="space-y-8">
				<div class="grid gap-8 md:grid-cols-2">
					<div class="group relative">
						<input
							id="contact-name"
							type="text"
							bind:value={formName}
							required
							placeholder=" "
							class="peer w-full border-b border-slate-300 dark:border-slate-700 bg-transparent pb-3 pl-3 pt-6 text-lg font-light text-slate-800 dark:text-slate-100 outline-none transition-colors duration-300 placeholder:text-transparent focus:border-slate-800"
						/>
						<label for="contact-name" class="pointer-events-none absolute left-3 top-6 text-base font-light text-slate-400 dark:text-slate-400 transition-all duration-300 peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:tracking-[0.2em] peer-not-placeholder-shown:text-slate-500 peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:tracking-[0.2em] peer-focus:text-slate-500">
							Full Name
						</label>
					</div>
					<div class="group relative">
						<input
							id="contact-email"
							type="email"
							bind:value={formEmail}
							required
							placeholder=" "
							class="peer w-full border-b border-slate-300 dark:border-slate-700 bg-transparent pb-3 pl-3 pt-6 text-lg font-light text-slate-800 dark:text-slate-100 outline-none transition-colors duration-300 placeholder:text-transparent focus:border-slate-800"
						/>
						<label for="contact-email" class="pointer-events-none absolute left-3 top-6 text-base font-light text-slate-400 dark:text-slate-400 transition-all duration-300 peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:tracking-[0.2em] peer-not-placeholder-shown:text-slate-500 peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:tracking-[0.2em] peer-focus:text-slate-500">
							Email Address
						</label>
					</div>
				</div>

				<div class="grid gap-8 md:grid-cols-2">
					<div class="group relative">
						<input
							id="contact-company"
							type="text"
							bind:value={formCompany}
							placeholder=" "
							class="peer w-full border-b border-slate-300 dark:border-slate-700 bg-transparent pb-3 pl-3 pt-6 text-lg font-light text-slate-800 dark:text-slate-100 outline-none transition-colors duration-300 placeholder:text-transparent focus:border-slate-800"
						/>
						<label for="contact-company" class="pointer-events-none absolute left-3 top-6 text-base font-light text-slate-400 dark:text-slate-400 transition-all duration-300 peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:tracking-[0.2em] peer-not-placeholder-shown:text-slate-500 peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:tracking-[0.2em] peer-focus:text-slate-500">
							Company / Organization
						</label>
					</div>
					<div class="group relative">
						<input
							id="contact-subject"
							type="text"
							bind:value={formSubject}
							required
							placeholder=" "
							class="peer w-full border-b border-slate-300 dark:border-slate-700 bg-transparent pb-3 pl-3 pt-6 text-lg font-light text-slate-800 dark:text-slate-100 outline-none transition-colors duration-300 placeholder:text-transparent focus:border-slate-800"
						/>
						<label for="contact-subject" class="pointer-events-none absolute left-3 top-6 text-base font-light text-slate-400 dark:text-slate-400 transition-all duration-300 peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:tracking-[0.2em] peer-not-placeholder-shown:text-slate-500 peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:tracking-[0.2em] peer-focus:text-slate-500">
							Subject
						</label>
					</div>
				</div>

				<div class="group relative">
					<textarea
						id="contact-message"
						bind:value={formMessage}
						required
						rows="5"
						placeholder=" "
						class="peer w-full resize-none border-b border-slate-300 dark:border-slate-700 bg-transparent pb-3 pt-6 text-lg font-light text-slate-800 dark:text-slate-100 outline-none transition-colors duration-300 placeholder:text-transparent focus:border-slate-800"
					></textarea>
					<label for="contact-message" class="pointer-events-none absolute left-3 top-6 text-base font-light text-slate-400 dark:text-slate-400 transition-all duration-300 peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:tracking-[0.2em] peer-not-placeholder-shown:text-slate-500 peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:tracking-[0.2em] peer-focus:text-slate-500">
						Your Message
					</label>
				</div>

				<div class="flex flex-col-reverse items-center gap-6 pt-8 md:flex-row md:justify-between">
					<p class="text-sm font-light text-slate-400 dark:text-slate-400">
						{#if formStatus === 'sent'}
							Message sent successfully.
						{:else if formStatus === 'error'}
							Something went wrong. Please try again.
						{/if}
					</p>
					<div
						bind:this={magneticBtn}
						class="magnetic-btn-wrapper relative inline-block"
						onmousemove={handleMagneticMove}
						onmouseleave={handleMagneticLeave}
						role="presentation"
					>
						<button
							type="submit"
							disabled={formStatus === 'sending'}
							class="magnetic-btn group relative inline-flex overflow-hidden border border-slate-400 dark:border-slate-600 bg-slate-800 px-16 py-6 text-base font-light tracking-[0.3em] text-white uppercase backdrop-blur-sm transition-all duration-300 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
							style="transform: translate({btnX}px, {btnY}px)"
						>
							<span class="relative z-10 transition-transform duration-300 group-hover:scale-105">
								{#if formStatus === 'sending'}
									Sending...
								{:else if formStatus === 'sent'}
									Sent
								{:else}
									Send Message
								{/if}
							</span>
							<div class="absolute inset-0 -translate-y-full bg-slate-700 transition-transform duration-500 group-hover:translate-y-0"></div>
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</section>
