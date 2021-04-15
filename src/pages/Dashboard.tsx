import { AsyncBoundary } from 'async-boundary';
import * as React from 'react';
import {
	ChangeEventHandler,
	unstable_startTransition,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { defineLoader, useDataLoader } from '../lib/dataLoader';
import { CountryCard } from '../modules/CountryCard';
import { PageFrame } from '../modules/PageFrame';
import { useProcessedSearchTerm } from '../modules/Search/hooks';
import type { RankData } from '../types';

import styles from './Dashboard.module.css';

const loader = defineLoader<{ year: string; countries: string[] }, RankData[]>({
	family: 'ranking',
	getKey({ year, countries }) {
		return year + countries.join('');
	},
	getData({ countries, year }, api) {
		return countries.length
			? countries.map((country) => api.rankings({ year, country }))
			: api.rankings({ year });
	},
});

const years = new Array(6).fill(1).map((_, i) => (2020 - i).toString());

export default () => {
	const { countries = [], year: searchYear = years[0] } =
		useProcessedSearchTerm() ?? {};
	const [year, setYear] = useState(searchYear);

	const data = useDataLoader(loader, { year, countries });

	const updateYear = useCallback((year: string) => {
		unstable_startTransition(() => {
			setYear(year);
		});
	}, []);

	const onYearChangeHandler = useCallback<
		ChangeEventHandler<HTMLSelectElement>
	>((e) => {
		const value = e.currentTarget.value;
		updateYear(value);
	}, []);

	useEffect(() => {
		updateYear(searchYear);
	}, [searchYear]);

	// TODO: we need a spinner for this async-boundary

	return (
		<PageFrame>
			<div>
				<select value={year} onChange={onYearChangeHandler}>
					{years.map((i) => (
						<option key={i} value={i}>
							{i}
						</option>
					))}
				</select>
			</div>
			<div className={styles.grid}>
				{data.slice(0, 10).map((item) => (
					<AsyncBoundary key={item.country}>
						<CountryCard data={item} />
					</AsyncBoundary>
				))}
			</div>
		</PageFrame>
	);
};
