import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button, buttonStyles } from './Button';
import styles from './Header.module.css';
import { SearchInput } from './Search/SearchInput';

export const Header = () => {
	const { isAuthenticated } = useAuth();

	return (
		<div className={styles.root}>
			<div>😊</div>
			<nav className={styles.nav}>
				<Link to="/dashboard" className={buttonStyles}>
					Dashboard
				</Link>
				<Link to="/rankings" className={buttonStyles}>
					Rankings
				</Link>
			</nav>
			<div>
				<SearchInput />
			</div>
			{isAuthenticated ? (
				<Button>Logout</Button>
			) : (
				<Link to="/login" className={buttonStyles}>
					Login
				</Link>
			)}
		</div>
	);
};
