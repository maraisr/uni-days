import type { FunctionComponent } from 'react';
import * as React from 'react';

import styles from './FormWrapper.module.css';

export const FormWrapper: FunctionComponent = ({ children }) => {
	return <div className={styles.component}>{children}</div>;
};
