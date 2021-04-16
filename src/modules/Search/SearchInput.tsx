import { SearchIcon } from '@heroicons/react/outline';
import type { ChangeEventHandler } from 'react';
import * as React from 'react';
import { unstable_startTransition, useCallback, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import styles from './SearchInput.module.css';

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
