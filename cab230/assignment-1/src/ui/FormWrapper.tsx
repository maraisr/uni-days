import type { FunctionComponent } from 'react';
import * as React from 'react';

import styles from './styles/FormWrapper.module.css';

export const FormWrapper: FunctionComponent = ({ children }) => (
	<div className={styles.component}>{children}</div>
);
