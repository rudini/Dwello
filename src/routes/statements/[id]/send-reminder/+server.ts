import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
	const { id } = params;

	try {
		const body = await request.json();
		const { reminderLevel, tenantEmail, tenantName } = body;

		// Validate reminder level
		if (!reminderLevel || ![1, 2, 3].includes(reminderLevel)) {
			return json(
				{
					success: false,
					message: 'Ungültige Mahnstufe'
				},
				{ status: 400 }
			);
		}

		// TODO: In production, this would:
		// 1. Call the backend API to log the reminder
		// 2. Send an email via email service
		// const response = await fetch(`${BACKEND_URL}/api/v1/statements/${id}/reminder`, {
		//   method: 'POST',
		//   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
		//   body: JSON.stringify({ reminderLevel })
		// });

		const reminderDate = new Date().toISOString();

		// Mock response for now
		console.log(`Sending reminder level ${reminderLevel} to ${tenantName} (${tenantEmail}) for statement ${id}`);

		return json({
			success: true,
			message: `${reminderLevel}. Mahnung erfolgreich versendet`,
			data: {
				id,
				reminderLevel,
				reminderDate,
				recipientEmail: tenantEmail
			}
		});
	} catch (error) {
		console.error('Error sending reminder:', error);
		return json(
			{
				success: false,
				message: 'Fehler beim Versenden der Mahnung'
			},
			{ status: 500 }
		);
	}
};
