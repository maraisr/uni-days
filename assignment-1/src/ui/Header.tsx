import * as React from 'react';
import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { SearchInput } from '../modules/SearchInput';
import { Button, buttonStyles } from './Button';
import styles from './styles/Header.module.css';

export const Header = () => {
	const { isAuthenticated, logout, user } = useAuth();

	return (
		<div className={styles.root}>
			<div>😊</div>
			<nav className={styles.nav}>
				<Link to="/dashboard" className={buttonStyles}>
					Dashboard
				</Link>
			</nav>
			<Suspense fallback={null}>
				<SearchInput />
			</Suspense>
			{isAuthenticated ? (
				<div className={styles.profile}>
					{user ? <p>{user.email}</p> : null}
					<Button onClick={logout}>Logout</Button>
				</div>
			) : (
				<Link to="/login" className={buttonStyles}>
					Login
				</Link>
			)}
		</div>
	);
};
