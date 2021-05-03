import { ChevronDownIcon } from '@heroicons/react/outline';
import type { ChangeEventHandler, FunctionComponent } from 'react';
import * as React from 'react';

import styles from './styles/Select.module.css';

export const Select: FunctionComponent<{
	value: string;
	onChange: ChangeEventHandler<HTMLSelectElement>;
}> = ({ onChange, value, children }) => {
	return (
		<div className={styles.component}>
			<select value={value} onChange={onChange}>
				{children}
			</select>
			<ChevronDownIcon width="1.25rem" />
		</div>
	);
};
