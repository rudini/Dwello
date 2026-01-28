import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	// TODO: In production, this would fetch the PDF from the backend
	// const response = await fetch(`${BACKEND_URL}/api/v1/statements/${id}/pdf`, {
	//   headers: { Authorization: `Bearer ${jwt}` }
	// });
	// return new Response(response.body, {
	//   headers: {
	//     'Content-Type': 'application/pdf',
	//     'Content-Disposition': `attachment; filename="abrechnung-${id}.pdf"`
	//   }
	// });

	// For now, return a placeholder response
	// In production, this would stream the actual PDF file
	const placeholderMessage = `PDF für Abrechnung ${id} wird generiert...`;

	return new Response(placeholderMessage, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
};
