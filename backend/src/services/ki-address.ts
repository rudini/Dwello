/** The provider address Dwello sends requests and the API key to (#1372) */

import { CodedError } from './coded-error';

// The landlord's own network, which may answer over http (#580): private and loopback addresses and names without a
// dot, such as a compose service; a provider on the internet gets the key only over https (decided in #1372)
const OWN_NETWORK =
	/^((10|127)(\.\d+){3}|192\.168(\.\d+){2}|172\.(1[6-9]|2\d|3[01])(\.\d+){2}|\[::1\]|\[f[cd][\da-f]{2}:[^\]]*\]|[^.[]+)$/i;

// Dwello appends the path to the address itself: credentials, a query or a fragment in it would send the request
// elsewhere (#1372); the code says what does not fit (persona Anna 1372 P-1)
function addressProblem(baseUrl: string) {
	const url = URL.parse(baseUrl);
	if (!url || !['http:', 'https:'].includes(url.protocol)) return 'KI_ADDRESS_INVALID';
	if (/[?#]/.test(baseUrl)) return 'KI_ADDRESS_SUFFIX';
	if (url.username || url.password) return 'KI_ADDRESS_CREDENTIALS';
	if (url.protocol === 'http:' && !OWN_NETWORK.test(url.hostname)) return 'KI_ADDRESS_NOT_HTTPS';
	return null;
}

export function checkAddress(baseUrl: string) {
	const problem = addressProblem(baseUrl);
	if (problem) throw new CodedError(problem, 'Diese Adresse kann Dwello nicht verwenden.');
}
