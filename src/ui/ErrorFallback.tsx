import * as React from 'react';
import type { ErrorFallbackComponentType } from 'async-boundary';
import { DefaultErrorFallbackComponent } from 'async-boundary';

import styles from './styles/ErrorFallback.module.css';

export const ErrorFallback: ErrorFallbackComponentType = ({
	error,
	retryFn,
}) => (
	<div className={styles.component}>
		<DefaultErrorFallbackComponent error={error} retryFn={retryFn} />
	</div>
);
