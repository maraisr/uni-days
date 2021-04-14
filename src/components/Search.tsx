import type { ChangeEventHandler } from 'react';
import * as React from 'react';
import {
	useCallback,
	unstable_startTransition,
	unstable_useDeferredValue,
	useState,
	useEffect,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import styles from './Search.module.css';

export const useSearchTerm = () => {
	const [params] = useSearchParams();
	return unstable_useDeferredValue(params.get('q') ?? '');
};

export const useDebouncedSearchTerm = () => {
	const search = useSearchTerm();
	const [searchTerm, setSearchTerm] = useState(search);

	useEffect(() => {
		const tm = setTimeout(() => setSearchTerm(search), 300);
		return () => void clearTimeout(tm);
	}, [search]);

	return searchTerm;
};

export const SearchInput = () => {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const currentSearchTerm = params.get('q') ?? '';

	const onChangeHandler = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			const replace = /search$/.test(window.location.pathname);

			unstable_startTransition(() => {
				if (e.currentTarget.value) {
					navigate(
						{
							pathname: '/search',
							search: `?q=${encodeURIComponent(
								e.currentTarget.value,
							)}`,
						},
						{
							replace,
						},
					);
				} else {
					navigate(
						{
							pathname: '/search',
						},
						{ replace },
					);
				}
			});
		},
		[],
	);

	return (
		<input
			className={styles.component}
			placeholder="Search..."
			value={currentSearchTerm}
			onChange={onChangeHandler}
		/>
	);
};
