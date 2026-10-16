/** A stored file as a download: its kind and its name, an ASCII one for old clients and the real one (umlauts,
 * dashes) per RFC 6266 and RFC 5987 */
export function fileResponse(
	set: { headers: Record<string, string | number> },
	file: { fileName: string; mimeType: string; content: Buffer }
) {
	set.headers['content-type'] = file.mimeType;
	const ascii = file.fileName.replace(/[^\x20-\x7e]|["\\]/g, '_');
	const utf8 = encodeURIComponent(file.fileName).replace(/['()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
	set.headers['content-disposition'] = `attachment; filename="${ascii}"; filename*=UTF-8''${utf8}`;
	return file.content;
}
