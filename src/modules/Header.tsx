import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button, buttonStyles } from './Button';
import styles from './Header.module.css';
import { SearchInput } from './SearchInput';

export const Header = () => {
	const { isAuthenticated, logout } = useAuth();

	return (
		<div className={styles.root}>
			<div>😊</div>
			<nav className={styles.nav}>
				<Link to="/dashboard" className={buttonStyles}>
					Dashboard
				</Link>
			</nav>
			<SearchInput />
			{isAuthenticated ? (
				<Button onClick={logout}>Logout</Button>
			) : (
				<Link to="/login" className={buttonStyles}>
					Login
				</Link>
			)}
		</div>
	);
};
