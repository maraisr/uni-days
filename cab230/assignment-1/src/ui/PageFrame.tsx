import type { FunctionComponent } from 'react';
import * as React from 'react';
import styles from './styles/PageFrame.module.css';

export const PageFrame: FunctionComponent = ({ children }) => (
	<div className={styles.component}>{children}</div>
);
