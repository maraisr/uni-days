import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import * as React from 'react';
import styles from './styles/SmallMessage.module.css';

export const SmallMessage: FunctionComponent<{ error?: boolean }> = ({
	error,
	children,
}) => (
	<p className={clsx(styles.component, error && styles.error)}>{children}</p>
);
