import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	const { name, email, company, subject, message } = await request.json();

	if (!name || !email || !subject || !message) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const resend = new Resend(env.RESEND_API_KEY);

	const { error } = await resend.emails.send({
		from: 'Contact Form <onboarding@resend.dev>',
		to: env.CONTACT_EMAIL ?? '',
		replyTo: email,
		subject: `[KEG Contact] ${subject}`,
		html: `
			<h2>New Contact Form Submission</h2>
			<p><strong>Name:</strong> ${name}</p>
			<p><strong>Email:</strong> ${email}</p>
			<p><strong>Company:</strong> ${company || 'N/A'}</p>
			<p><strong>Subject:</strong> ${subject}</p>
			<hr />
			<p>${message.replace(/\n/g, '<br />')}</p>
		`
	});

	if (error) {
		return json({ error: 'Failed to send email' }, { status: 500 });
	}

	return json({ success: true });
}
