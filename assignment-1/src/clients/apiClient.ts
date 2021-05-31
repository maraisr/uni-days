import { API_HOST } from '../consts';
import type { ApiClients } from '../lib/dataLoader';
import { fetchWithThrow, timeoutFetch } from '../lib/helpers';

/**
 * The client that interacts with our api.
 */
export default (getToken: () => string) =>
	({
		/**
		 * Gets you the rankings for an optional year + country
		 */
		async rankings({ country, year }) {
			const apiEndpoint = new URL(`${API_HOST}/rankings`);
			year && apiEndpoint.searchParams.set('year', year);
			country && apiEndpoint.searchParams.set('country', country);
			return fetchWithThrow(timeoutFetch(apiEndpoint.toString()));
		},
		/**
		 * Gets you a series of countries
		 */
		async countries() {
			return fetchWithThrow(timeoutFetch(`${API_HOST}/countries`));
		},
		/**
		 * A protected endpoint that dives deeper into the rankings
		 */
		async factors({ country, year }) {
			const apiEndpoint = new URL(`${API_HOST}/factors/${year}`);
			country && apiEndpoint.searchParams.set('country', country);
			return fetchWithThrow(
				timeoutFetch(apiEndpoint.toString(), {
					headers: {
						Authorization: `Bearer ${getToken()}`,
					},
				}),
			);
		},
	} as ApiClients);
