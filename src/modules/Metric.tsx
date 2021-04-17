import clsx from 'clsx';
import * as React from 'react';
import { FunctionComponent } from 'react';
import styles from './Metric.module.css';

export const Metric: FunctionComponent<{
	className?: string;
	label: string;
	alignLeft?: boolean;
}> = ({ label, alignLeft = false, children, className }) => (
	<div
		className={clsx(styles.component, alignLeft && styles.left, className)}
	>
		{children}
		<span>{label}</span>
	</div>
);
