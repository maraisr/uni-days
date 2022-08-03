import { API_HOST } from '../consts';
import type { AuthClient } from '../lib/auth';
import { fetchWithThrow, timeoutFetch } from '../lib/helpers';

const AUTH_TOKEN_KEY = 'auth::token' as const;

export default {
	/**
	 * Sync gets the token from the store—which may or may not exist. Throws if no token.
	 */
	getToken() {
		const probe = localStorage.getItem(AUTH_TOKEN_KEY);
		if (!probe) throw new Error('No token');
		return probe;
	},
	/**
	 * Logs the user in.
	 */
	async login(username, password) {
		const operation = await fetchWithThrow<{ token: string }>(
			timeoutFetch(`${API_HOST}/user/login`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({ email: username, password }),
			}),
		);
		localStorage.setItem(AUTH_TOKEN_KEY, operation.token);
		return operation.token;
	},
	/**
	 * Logs the user out—then reloads the page. We reload to wipe out any sensative in-memory things.
	 */
	logout() {
		localStorage.clear();
		window.location.reload();
	},
	/**
	 * Simply checks if there is an authenticated session. This does not verify the expiry, we rely on the remote to
	 * tell us this.
	 *
	 * NOTE; in the future we could get tricky with refresh tokens and preemptively renew those, thus this method
	 * _could_ return a slightly different result.
	 */
	isAuthenticated() {
		return !!localStorage.getItem(AUTH_TOKEN_KEY);
	},
	/**
	 * Registers the user
	 */
	async register(username, password) {
		const operation = await fetchWithThrow<{ token: string }>(
			timeoutFetch(`${API_HOST}/user/register`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({ email: username, password }),
			}),
		);
		localStorage.setItem(AUTH_TOKEN_KEY, operation.token);
		return operation.token;
	},
} as AuthClient;
