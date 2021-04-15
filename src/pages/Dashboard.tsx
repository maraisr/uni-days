import { AsyncBoundary } from 'async-boundary';
import * as React from 'react';
import { useMemo } from 'react';
import { defineLoader, useDataLoader } from '../lib/dataLoader';
import { CountryCard, CountryCardData } from '../modules/CountryCard';
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

	// TODO: We should sort this, by rank, by country. Maybe even send all country data into card, and not just single payload
	const result = useMemo(() => {
		const result: CountryCardData[] = [];

		for (const country of data) {
			let probe = result.find((item) => item.country === country.country);

			if (!probe) {
				result.push(
					(probe = {
						...country,
						points: [],
					}),
				);
			}

			probe.points.push(country.rank);
		}

		return result;
	}, [data]);

	// TODO: we need a spinner for this async-boundary

	return (
		<PageFrame>
			<div className={styles.grid}>
				{result.map((data) => (
					<AsyncBoundary key={data.country}>
						<CountryCard data={data} />
					</AsyncBoundary>
				))}
			</div>
		</PageFrame>
	);
};
