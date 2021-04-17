import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import * as React from 'react';
import styles from './SmallMessage.module.css';

export const SmallMessage: FunctionComponent<{ error?: boolean }> = ({
	error,
	children,
}) => {
	return (
		<p className={clsx(styles.component, error && styles.error)}>
			{children}
		</p>
	);
};
