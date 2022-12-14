import * as React from 'react';
import { memo } from 'react';

import styles from './styles/Spinner.module.css';

export const Spinner = memo(() => (
	<div className={styles.loader}>Loading...</div>
));
