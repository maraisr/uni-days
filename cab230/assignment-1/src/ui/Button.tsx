import type { FunctionComponent, MouseEventHandler } from 'react';
import * as React from 'react';

import styles from './styles/Button.module.css';

export const buttonStyles = styles.component;

export const Button: FunctionComponent<{
	onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({ children, onClick }) => (
	<button className={buttonStyles} onClick={onClick}>
		{children}
	</button>
);
