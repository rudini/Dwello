/** HTTP answer for a service's delete result: 204, or 404 / 409 / 400 with the reason */
export function deleteResponse(
	set: { status?: number | string },
	result: { success: boolean; conflict?: boolean; error?: string }
) {
	if (result.success) {
		set.status = 204;
		return null;
	}
	set.status = result.conflict ? 409 : result.error?.includes('not found') ? 404 : 400;
	return { error: result.error };
}
