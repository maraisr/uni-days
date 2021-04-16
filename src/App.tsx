import * as React from 'react';
import { lazy, LazyExoticComponent, memo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AsyncBoundary } from './modules/Boundaries';
import { Layout } from './modules/Layout';
import { Spinner } from './modules/Spinner';

const DashboardPage = lazy(() => import('./pages/Dashboard'));
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));

const SuspensefullPage = memo<{ importee: LazyExoticComponent<any> }>(
	({ importee: Importee }) => (
		<AsyncBoundary fallback={<Spinner />}>
			<Importee />
		</AsyncBoundary>
	),
);

export const App = () => (
	<Layout>
		<Routes>
			<Route
				path="/login"
				element={<SuspensefullPage importee={LoginPage} />}
			/>
			<Route
				path="/register"
				element={<SuspensefullPage importee={RegisterPage} />}
			/>
			<Route
				path="/dashboard"
				element={<SuspensefullPage importee={DashboardPage} />}
			/>
			<Route path="/*" element={<Navigate to="/dashboard" />} />
		</Routes>
	</Layout>
);
