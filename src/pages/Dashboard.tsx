import type { ChangeEventHandler } from 'react';
import * as React from 'react';
import {
	memo,
	unstable_useDeferredValue,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { defineLoader, useDataLoader } from '../lib/dataLoader';
import { Button } from '../modules/Button';
import { CountryCard } from '../modules/CountryCard';
import { PageFrame } from '../modules/PageFrame';
import { useProcessedSearchTerm, useSearchTerm } from '../modules/Search/hooks';
import { Select } from '../modules/Select';
import type { RankData } from '../types';

import styles from './Dashboard.module.css';

const years = new Array(6).fill(1).map((_, i) => (2020 - i).toString());
const PAGE_SIZE = 8;

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

const NoResults = () => {
	const searchTerm = useSearchTerm();

	return (
		<div className={styles.noResults}>
			<p>
				No results for "
				<span className={styles.searchTerm}>{searchTerm}</span>".
			</p>
			<p>Please try and refine your search.</p>
		</div>
	);
};

export default memo(() => {
	// TODO: Figure out why this component has 3+ renders on load

	const { countries = [], year: searchYear = years[0] } =
		useProcessedSearchTerm() ?? {};
	const [year, setYear] = useState(searchYear);
	const yearForApi = unstable_useDeferredValue(year);
	const [page, setPage] = useState(1);

	const data = useDataLoader(loader, { year: yearForApi, countries });

	const updateYear = useCallback((year: string) => {
		setYear(year);
		setPage(1);
	}, []);

	const onYearChangeHandler = useCallback<
		ChangeEventHandler<HTMLSelectElement>
	>((e) => {
		const value = e.currentTarget.value;
		updateYear(value);
	}, []);

	useEffect(() => {
		if (searchYear !== year) updateYear(searchYear);
	}, [searchYear]);

	const loadMoreHandler = useCallback(() => {
		setPage((page) => page + 1);
	}, []);

	const result = useMemo(() => data.slice(0, page * PAGE_SIZE), [data, page]);

	const has_more = result.length < data.length;
	const has_results = data.length > 0;

	return (
		<PageFrame>
			<div className={styles.stack}>
				<div className={styles.toolbar}>
					<Select value={year} onChange={onYearChangeHandler}>
						{years.map((i) => (
							<option key={i} value={i}>
								{i}
							</option>
						))}
					</Select>
				</div>
				{has_results ? (
					<>
						<div className={styles.grid}>
							{result.map((item) => (
								<CountryCard key={item.country} data={item} />
							))}
						</div>
						<div className={styles.center}>
							{has_more ? (
								<Button onClick={loadMoreHandler}>
									Load More
								</Button>
							) : null}
						</div>
					</>
				) : (
					<NoResults />
				)}
			</div>
		</PageFrame>
	);
});
