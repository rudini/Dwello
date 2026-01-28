import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
	const { id } = params;

	try {
		const body = await request.json();
		const paidDate = body.paidDate || new Date().toISOString().split('T')[0];

		// TODO: In production, this would call the backend API
		// const response = await fetch(`${BACKEND_URL}/api/v1/statements/${id}/status`, {
		//   method: 'PUT',
		//   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
		//   body: JSON.stringify({ status: 'paid', paidDate })
		// });

		// Mock response for now
		console.log(`Marking statement ${id} as paid on ${paidDate}`);

		return json({
			success: true,
			message: 'Abrechnung als bezahlt markiert',
			data: {
				id,
				status: 'paid',
				paidDate
			}
		});
	} catch (error) {
		console.error('Error marking statement as paid:', error);
		return json(
			{
				success: false,
				message: 'Fehler beim Markieren der Abrechnung als bezahlt'
			},
			{ status: 500 }
		);
	}
};
