import type { ChangeEventHandler } from 'react';
import * as React from 'react';
import { useCallback, unstable_startTransition } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchIcon } from '@heroicons/react/outline';

import styles from './SearchInput.module.css';

export const SearchInput = () => {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const currentSearchTerm = params.get('q') ?? '';
	// TODO: Little bug here, try and correct string partially

	const onChangeHandler = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			const replace = /dashboard$/.test(window.location.pathname);

			unstable_startTransition(() => {
				if (e.currentTarget.value) {
					navigate(
						{
							pathname: '/dashboard',
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
							pathname: '/dashboard',
						},
						{ replace },
					);
				}
			});
		},
		[],
	);

	return (
		<div className={styles.component}>
			<input
				className={styles.input}
				placeholder="Search... eg. Denmark and Finland in 2017"
				defaultValue={currentSearchTerm}
				onChange={onChangeHandler}
			/>
			<SearchIcon width="20px" />
		</div>
	);
};
