import * as React from 'react';
import { lazy, LazyExoticComponent, memo } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AsyncBoundary } from './modules/Boundaries';
import { Layout } from './modules/Layout';

const DashboardPage = lazy(() => import('./pages/Dashboard'));

const SuspensefullPage = memo<{ importee: LazyExoticComponent<any> }>(
	({ importee: Importee }) => (
		<AsyncBoundary>
			<Importee />
		</AsyncBoundary>
	),
);

export const App = () => (
	<Routes>
		<Route path="/login" element={<p>login</p>} />
		<Route path="/register" element={<p>registration</p>} />
		<Route
			path="/*"
			element={
				<Layout>
					<Routes>
						<Route
							path="/dashboard"
							element={
								<SuspensefullPage importee={DashboardPage} />
							}
						/>
						<Route element={<Navigate to="/dashboard" />} />
					</Routes>
				</Layout>
			}
		/>
	</Routes>
);
