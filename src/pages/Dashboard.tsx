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
import { APP_TITLE, YEARS } from '../consts';
import { defineLoader, useDataLoader } from '../lib/dataLoader';
import { CountryCard } from '../modules/CountryCard';
import { useProcessedSearchTerm, useSearchTerm } from '../modules/SearchInput';
import type { RankData } from '../types';
import { Button } from '../ui/Button';
import { PageFrame } from '../ui/PageFrame';
import { Select } from '../ui/Select';

import styles from './styles/Dashboard.module.css';

const PAGE_SIZE = 8;

const loader = defineLoader<{ year: string; countries: string[] }, RankData[]>({
	family: 'dashboard.rankings',
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

	const { countries = [], year: searchYear = YEARS[0] } =
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

	useEffect(() => {
		document.title = `Dashboard | ${APP_TITLE}`;
	}, []);

	const loadMoreHandler = useCallback(() => {
		setPage((page) => page + 1);
	}, []);

	const sortedData = useMemo(
		() =>
			data.sort((a, b) =>
				a.rank === b.rank ? 0 : a.rank > b.rank ? 1 : -1,
			),
		[data],
	);
	const result = useMemo(() => sortedData.slice(0, page * PAGE_SIZE), [
		sortedData,
		page,
	]);

	const hasMore = result.length < data.length;
	const hasResults = data.length > 0;

	return (
		<PageFrame>
			<div className={styles.stack}>
				<div className={styles.toolbar}>
					<Select value={year} onChange={onYearChangeHandler}>
						{YEARS.map((i) => (
							<option key={i} value={i}>
								{i}
							</option>
						))}
					</Select>
				</div>
				{hasResults ? (
					<>
						<div className={styles.grid}>
							{result.map((item) => (
								<CountryCard key={item.country} data={item} />
							))}
						</div>
						<div className={styles.center}>
							{hasMore ? (
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
