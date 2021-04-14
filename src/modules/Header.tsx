import * as React from 'react';
import { Link } from 'react-router-dom';
import { SearchInput } from '../components/Search';
import styles from './Header.module.css';

export const Header = () => (
	<div className={styles.root}>
		<div>😊</div>
		<nav className={styles.nav}>
			<Link to="/dashboard">Dashboard</Link>
			<Link to="/rankings">Rankings</Link>
		</nav>
		<div>
			<SearchInput />
		</div>
		<div>Profile</div>
	</div>
);
