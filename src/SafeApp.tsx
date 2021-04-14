import { lazy, LazyExoticComponent, memo } from 'react';
import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AsyncBoundary } from './modules/Boundaries';
import { Layout } from './modules/Layout';

const SearchPage = lazy(() => import('./pages/Search'));

const SuspensefullPage = memo<{ importee: LazyExoticComponent<any> }>(
	({ importee: Importee }) => (
		<AsyncBoundary>
			<Importee />
		</AsyncBoundary>
	),
);

export default () => <Layout>
	<Routes>
		<Route
			path='/search'
			element={<SuspensefullPage importee={SearchPage} />}
		/>
	</Routes>
</Layout>
