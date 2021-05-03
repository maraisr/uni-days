import { SearchIcon } from '@heroicons/react/outline';
import type { ChangeEventHandler } from 'react';
import * as React from 'react';
import {
	unstable_startTransition,
	unstable_useDeferredValue,
	useCallback,
	useRef,
	useState,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import styles from './styles/SearchInput.module.css';

export const useSearchTerm = () => {
	const [params] = useSearchParams();
	return unstable_useDeferredValue(params.get('q') ?? '');
};

export const useProcessedSearchTerm = () => {
	const searchTerm = useSearchTerm();

	const returns: { year: string; countries: string[] } = {
		year: '',
		countries: [],
	};

	const searchTermMatches = searchTerm.match(
		/(?:(?<c>[a-z]+)\s?((?=and)and\s?(?<c2>[a-z]+))?\s?(?:in|for|at)?\s?)?(?<y>[0-9]{4})?/i,
	);
	if (searchTermMatches) {
		const { groups } = searchTermMatches;
		returns.countries = [groups.c, groups.c2].filter(Boolean);
		returns.year = groups.y;

		return returns;
	}

	return null;
};

export const SearchInput = () => {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const [loadedSearchTerm] = useState(() => params.get('q') ?? '');
	const changeRef = useRef<number>();

	const onChangeHandler = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			const value = e.currentTarget.value;

			if (changeRef.current) clearTimeout(changeRef.current);
			changeRef.current = setTimeout(() => {
				const replace = /dashboard$/.test(window.location.pathname);

				unstable_startTransition(() => {
					if (value) {
						navigate(
							{
								pathname: '/dashboard',
								search: `?q=${encodeURIComponent(value)}`,
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
		},
		[],
	);

	return (
		<div className={styles.component}>
			<SearchIcon width="20px" />
			<input
				className={styles.input}
				placeholder="Search... eg. Denmark and Finland in 2017"
				defaultValue={loadedSearchTerm}
				onChange={onChangeHandler}
			/>
		</div>
	);
};
