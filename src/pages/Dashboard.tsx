import * as React from 'react';
import { defineLoader, useDataLoader } from '../lib/dataLoader';
import { CountryCard } from '../modules/CountryCard';
import { PageFrame } from '../modules/PageFrame';
import { useDebouncedSearchTerm } from '../modules/Search/hooks';
import { collectTerms } from '../modules/Search/processing';
import type { RankData } from '../types';

import styles from './Dashboard.module.css';

const loader = defineLoader<{ searchTerm: string }, RankData[]>({
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

	return (
		<PageFrame>
			<div className={styles.grid}>
				{data.map((data) => (
					<CountryCard key={data.country} data={data} />
				))}
			</div>
		</PageFrame>
	);
};
