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
	const search_term = useSearchTerm();

	const returns: { year: string; countries: string[] } = {
		year: undefined,
		countries: [],
	};

	const terms = search_term.split(' ');
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
			returns.countries[returns.countries.length - 1] += ` ${term}`;
			continue;
		}

		returns.countries.push(term);
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
	const search_value = unstable_useDeferredValue(value);
	const changeRef = useRef<number>();
	const [suggest, setSuggest] = useState('');
	const tracking_suggest = useRef<string>(suggest);

	// Sigh...
	tracking_suggest.current = suggest;

	const countries = useDataLoader(loader);

	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (event.key === 'ArrowRight' || event.key === 'Tab') {
				const suggest_value = tracking_suggest.current;
				if (suggest_value.length > 0) {
					event.preventDefault();
					unstable_batchedUpdates(() => {
						setValue((prev) => prev + suggest_value);
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
		let term = search_value.trim();
		if (term.includes(' ')) {
			term = term.split(' ').pop();
		}

		if (term?.length > 1) {
			let haystack = countries;
			if (term[0] === '2') haystack = YEARS;
			const maybe_suggest = haystack.find((c) =>
				c.startsWith(term.toLowerCase()),
			);

			if (maybe_suggest && maybe_suggest !== term) {
				const trimLength = maybe_suggest.length - term.length;
				setSuggest(maybe_suggest.substr(-trimLength));
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
				if (search_value) {
					navigate(
						{
							pathname: '/dashboard',
							search: `?q=${encodeURIComponent(
								search_value.trim(),
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
	}, [countries, search_value]);

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
