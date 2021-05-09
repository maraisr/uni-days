import type { FunctionComponent } from 'react';
import * as React from 'react';
import styles from './styles/FormField.module.css';

export const FormField: FunctionComponent<{
	id: string;
	label: string;
	errors?: string;
}> = ({ children, label, id, errors }) => (
	<div className={styles.component}>
		<label htmlFor={id}>{label}</label>
		{children}
		{errors ? <p className={styles.error}>{errors}</p> : null}
	</div>
);
