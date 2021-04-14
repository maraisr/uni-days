import * as React from 'react';
import { defineLoader, useDataLoader } from '../lib/dataLoader';
import { useDebouncedSearchTerm } from '../modules/Search/hooks';
import { collectTerms } from '../modules/Search/processing';

const loader = defineLoader<{ searchTerm: string }>({
	family: 'ranking',
	getKey({ searchTerm }) {
		return searchTerm;
	},
	getData({ searchTerm }, api) {
		const outcome = collectTerms(searchTerm);

		if (outcome) {
			const { countries, year } = outcome;
			if (countries.length > 0) {
				return countries.map((country) =>
					api.rankings({ year, country }),
				);
			} else {
				return api.rankings({ year });
			}
		}

		return null;
	},
});

export default () => {
	const searchTerm = useDebouncedSearchTerm();
	const data = useDataLoader(loader, { searchTerm });

	return <pre>{JSON.stringify(data, null, 4)}</pre>;
};
