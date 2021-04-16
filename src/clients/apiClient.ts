import { API_HOST } from '../consts';
import { getCurrentAuthClient } from '../lib/auth';
import type { ApiClients } from '../lib/dataLoader';
import { fetchWithThrow } from '../lib/helpers';

export default {
	async rankings({ country, year }) {
		const apiEndpoint = new URL(`${API_HOST}/rankings`);
		year && apiEndpoint.searchParams.set('year', year);
		country && apiEndpoint.searchParams.set('country', country);
		return fetchWithThrow(fetch(apiEndpoint.toString()));
	},
	async countries() {
		return fetchWithThrow(fetch(`${API_HOST}/countries`));
	},
	async factors({ country, year }) {
		const apiEndpoint = new URL(`${API_HOST}/factors/${year}`);
		country && apiEndpoint.searchParams.set('country', country);
		return fetchWithThrow(
			fetch(apiEndpoint.toString(), {
				headers: {
					Authorization: `Bearer ${getCurrentAuthClient().getToken()}`,
				},
			}),
		);
	},
} as ApiClients;
