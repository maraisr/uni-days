import type { FunctionComponent, MouseEventHandler } from 'react';
import * as React from 'react';

import styles from './Button.module.css';

export const Button: FunctionComponent<{
	onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({ children, onClick }) => {
	return (
		<button className={styles.component} onClick={onClick}>
			{children}
		</button>
	);
};
