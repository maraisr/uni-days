import type { ApiClients } from './lib/dataLoader';

/*
[
    {
        "rank": 2,
        "country": "Denmark",
        "score": "7.522",
        "year": 2017
    }
]
 */

export default {
	async rankings({ country, year }) {
		const apiEndpoint = new URL('http://131.181.190.87:3000/rankings');
		year && apiEndpoint.searchParams.set('year', year);
		country && apiEndpoint.searchParams.set('country', country);
		const req = await fetch(apiEndpoint.toString());
		return req.json();
	},
	async countries() {
		const req = await fetch('http://131.181.190.87:3000/countries');
		return req.json();
	},
} as ApiClients;
