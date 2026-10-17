import type { RequestHandler } from './$types';
import { forwardMutation } from '$lib/server/api-proxy';

// PUT /api/contracts/[id]/agreements: the landlord's answer whether the contract agrees a category (#91)
export const PUT: RequestHandler = ({ params, request, cookies }) =>
	forwardMutation(`/contracts/${params.id}/agreements`, 'PUT', request, cookies);
