import { SearchIcon } from '@heroicons/react/outline';
import type { ChangeEventHandler } from 'react';
import * as React from 'react';
import {
	unstable_startTransition,
	unstable_useDeferredValue,
	useEffect,
	useRef,
	useState,
} from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { YEARS } from '../consts';
import { defineLoader, useDataLoader } from '../lib/dataLoader';

import styles from './styles/SearchInput.module.css';

export const useSearchTerm = () => {
	const [params] = useSearchParams();
	return unstable_useDeferredValue(params.get('q') ?? '');
};

export const useProcessedSearchTerm = () => {
	const searchTerm = useSearchTerm();

	const returns: { year: string; countries: string[] } = {
		year: undefined,
		countries: [],
	};

	const terms = searchTerm.split(' ');
	let i = 0;
	for (; i < terms.length; i++) {
		const term = terms[i];
		if (term === 'and') continue;

		const maybeHasNextItem = terms[i + 1];
		if (term === 'in') {
			if (
				maybeHasNextItem &&
				maybeHasNextItem[0] === '2' &&
				maybeHasNextItem.length === 4
			) {
				returns.year = maybeHasNextItem;
			}

			break;
		}

		if (
			returns.countries.length > 0 &&
			!['in', 'and'].includes(terms[i - 1])
		) {
			if (/[a-z]/i.test(term))
				returns.countries[returns.countries.length - 1] += ` ${term}`;
			continue;
		}

		if (/[a-z]/i.test(term)) returns.countries.push(term);
	}

	return returns;
};

const loader = defineLoader<never, string[]>({
	family: 'countries',
	getKey() {
		return '';
	},
	getData(_, api) {
		return api
			.countries()
			.then((countries) => countries.map((c: string) => c.toLowerCase()));
	},
});

export const SearchInput = () => {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const [value, setValue] = useState(() => params.get('q') ?? '');
	const searchValue = unstable_useDeferredValue(value);
	const changeRef = useRef<number>();
	const [suggest, setSuggest] = useState('');
	const trackingSuggest = useRef<string>(suggest);

	// Sigh...
	trackingSuggest.current = suggest;

	const countries = useDataLoader(loader);

	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (event.key === 'ArrowRight' || event.key === 'Tab') {
				const suggestValue = trackingSuggest.current;
				if (suggestValue.length > 0) {
					event.preventDefault();
					unstable_batchedUpdates(() => {
						setValue((prev) => prev + suggestValue);
						setSuggest('');
					});
				}
			}
		};

		window.addEventListener('keydown', handler);

		return () => {
			window.removeEventListener('keydown', handler);
		};
	}, []);

	useEffect(() => {
		let term = searchValue;
		if (term.includes(' ')) {
			term = term.split(' ').pop();
		}

		if (term?.length > 1) {
			let haystack = countries;
			// if string starts with 2 its going to be a year
			if (term[0] === '2') haystack = YEARS;

			const maybeSuggest = haystack.find((c) =>
				c.startsWith(term.toLowerCase().trim()),
			);

			if (maybeSuggest && maybeSuggest !== term) {
				const trimLength = maybeSuggest.length - term.length;
				setSuggest(maybeSuggest.substr(-trimLength));
			} else {
				setSuggest('');
			}
		} else {
			setSuggest('');
		}

		if (changeRef.current) clearTimeout(changeRef.current);

		changeRef.current = setTimeout(() => {
			const replace = /dashboard$/.test(window.location.pathname);

			unstable_startTransition(() => {
				if (searchValue) {
					navigate(
						{
							pathname: '/dashboard',
							search: `?q=${encodeURIComponent(
								searchValue.trim(),
							)}`,
						},
						{
							replace,
						},
					);
				} else {
					navigate(
						{
							pathname: '/dashboard',
						},
						{ replace },
					);
				}
			});
		}, 300);
	}, [countries, searchValue]);

	const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
		setValue(event.target.value);
	};

	return (
		<div className={styles.component}>
			<SearchIcon width="20px" />
			<div className={styles.autocomplete}>
				{value}
				{suggest ? <mark>{suggest}</mark> : null}
			</div>
			<input
				className={styles.input}
				placeholder="Search... eg. Denmark and Finland in 2017"
				value={value}
				onChange={onChangeHandler}
			/>
		</div>
	);
};
