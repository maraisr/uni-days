import type { LazyExoticComponent } from 'react';
import * as React from 'react';
import { lazy, memo, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './modules/Layout';

const SearchPage = lazy(() => import('./pages/Search'));

const SuspensefullPage = memo<{ importee: LazyExoticComponent<any> }>(
	({ importee: Importee }) => (
		<Suspense fallback="loading...">
			<Importee />
		</Suspense>
	),
);

export const App = () => (
	<Layout>
		<Routes>
			<Route
				path="/search"
				element={<SuspensefullPage importee={SearchPage} />}
			/>
		</Routes>
	</Layout>
);
