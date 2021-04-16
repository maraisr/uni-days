import { API_HOST } from '../consts';
import type { AuthClient } from '../lib/auth';
import { fetchWithThrow } from '../lib/helpers';

const AUTH_TOKEN_KEY = 'auth::token';

export default {
	getToken() {
		const probe = localStorage.getItem(AUTH_TOKEN_KEY);
		if (!probe) throw new Error('No token');
		return probe;
	},
	async login(username, password) {
		const operation = await fetchWithThrow<{ token: string }>(
			fetch(`${API_HOST}/user/login`, {
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
	logout() {
		localStorage.clear();
		window.location.reload();
	},
	isAuthenticated() {
		return !!localStorage.getItem(AUTH_TOKEN_KEY);
	},
	async register(username, password) {
		const operation = await fetchWithThrow<{ token: string }>(
			fetch(`${API_HOST}/user/register`, {
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
