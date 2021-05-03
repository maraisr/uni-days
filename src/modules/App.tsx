import { AsyncBoundary } from 'async-boundary';
import * as React from 'react';
import { lazy, LazyExoticComponent, memo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../ui/Layout';
import { Spinner } from '../ui/Spinner';

const DashboardPage = lazy(() => import('../pages/Dashboard'));
const LoginPage = lazy(() => import('../pages/Login'));
const RegisterPage = lazy(() => import('../pages/Register'));

const SuspensefullPage = memo<{ importee: LazyExoticComponent<any> }>(
	({ importee: Importee }) => (
		<AsyncBoundary fallback={<Spinner />}>
			<Importee />
		</AsyncBoundary>
	),
);

/*
You're probably wondering why this component is being memo'd? Let me tell you, this component _should_ be mounted
directly after the transport and auth providers, auth and data providers _may_ cause some re-renders from time to time
(especially the auth provider) and instead of running the entire render phase from react, let React simply walk the
Fibre tree instead—allowing for surgical updates.
 */
export const App = memo(() => (
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
));
