import { SearchIcon } from '@heroicons/react/outline';
import type { ChangeEventHandler } from 'react';
import * as React from 'react';
import {
	unstable_startTransition,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import styles from './SearchInput.module.css';

export const SearchInput = () => {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const [loadedSearchTerm] = useState(() => params.get('q') ?? '');
	const [search, setSearchValue] = useState(loadedSearchTerm);

	useEffect(() => {
		const tm = setTimeout(() => {
			const replace = /dashboard$/.test(window.location.pathname);

			unstable_startTransition(() => {
				if (search) {
					navigate(
						{
							pathname: '/dashboard',
							search: `?q=${encodeURIComponent(search)}`,
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

		return () => void clearTimeout(tm);
	}, [search]);

	const onChangeHandler = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			setSearchValue(e.currentTarget.value);
		},
		[],
	);

	return (
		<div className={styles.component}>
			<input
				className={styles.input}
				placeholder="Search... eg. Denmark and Finland in 2017"
				defaultValue={loadedSearchTerm}
				onChange={onChangeHandler}
			/>
			<SearchIcon width="20px" />
		</div>
	);
};
