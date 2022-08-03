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

/**
 * Returns a slightly delayed value, handy when active fibres exist and helps smoothen out jank. So value may **NOT**
 * accurately represent search term current entered into input.
 */
export const useSearchTerm = () => {
	const [params] = useSearchParams();
	return unstable_useDeferredValue(params.get('q') ?? '');
};

/**
 * Given a search term, returns a country string array and maybe year. Effectively decodes the search term into tokens
 * that can be used for searching.
 *
 * Processes terms:
 * "abc" -> {countries: ["abc"]}
 * "abc xyz" -> {countries: ["abc xyz"]}
 * "abc and xyz" -> {countries: ["abc", "xyz"]}
 * "abc and def and hij" -> {countries: ["abc", "def", "hij"]}
 * "abc in 2017" -> {countries: ["abc"], year: "2017"}
 *
 * Known issues;
 * - Countries with "and" in its name, is treated as 2 countries. eg:
 *      - Trinidad and Tobago
 *      - Bosnia and Herzegovina
 *
 * But this is a best effort, and gets the point across.
 */
export const useProcessedSearchTerm = () => {
	const searchTerm = useSearchTerm();

	const returns: { year: string; countries: string[] } = {
		year: undefined,
		countries: [],
	};

	const terms = searchTerm.split(' ').filter(Boolean);
	let i = 0;
	for (; i < terms.length; i++) {
		const term = terms[i];

		// Both "in" and "and" should be skipped

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

			// We break here as if we hit an "in" we look forward for a year, if we have we add. So we can always just
			// end the loop here.
			break;
		}

		if (
			returns.countries.length > 0 &&
			// if we have countries, and the last term was either "in" or "and" then we know to _concat_ with previous,
			// rather than push
			!['in', 'and'].includes(terms[i - 1])
		) {
			// `abc xyz` is caught here
			if (/[a-z]/i.test(term))
				returns.countries[returns.countries.length - 1] += ` ${term}`;
			continue;
		}

		// this will push for `"and abc"` or `"abc"`
		if (/[a-z]/i.test(term)) returns.countries.push(term);
	}

	return returns;
};

const countriesDataLoader = defineLoader<never, string[]>({
	family: 'countries',
	getKey() {
		return '';
	},
	getData(_, api) {
		return api.countries();
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

	const countries = useDataLoader(countriesDataLoader);

	// A hook to trap for "tab" and arrow keys to "autocomplete" a potential suggestion.
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
		const term = searchValue.split(' ').pop();

		// Instigates a potential suggestion
		if (term?.length > 1) {
			let haystack = countries;
			// if string starts with 2 its going to be a year
			if (term[0] === '2') haystack = YEARS;

			const maybeSuggest = haystack.find((c) =>
				c.toLowerCase().startsWith(term.toLowerCase().trim()),
			);

			if (
				maybeSuggest &&
				maybeSuggest.toLowerCase() !== term.toLowerCase()
			) {
				// this trim logic finds the "rest" of the word we matched on
				// abcdef
				//    ^
				const trimLength = maybeSuggest.length - term.length;
				setSuggest(maybeSuggest.substr(-trimLength));
			} else {
				setSuggest('');
			}
		} else {
			setSuggest('');
		}

		// This is here to "update" the url"
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
