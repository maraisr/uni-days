import * as React from 'react';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { withRequiredAuthentication } from './lib/auth';
import { AsyncBoundary } from './modules/Boundaries';

const SafeApp = lazy(() => import('./SafeApp'));

const AuthProtectedApp = withRequiredAuthentication(() => <SafeApp />);

export const App = () => <>
	<Routes>
		<Route
			path='/login'
			element={<p>login</p>}
		/>
	</Routes>
	<AsyncBoundary>
		<AuthProtectedApp />
	</AsyncBoundary>
</>;
