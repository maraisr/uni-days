import * as React from 'react';
import { memo, StrictMode, useRef } from 'react';
import { unstable_createRoot } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import apiClient from './clients/apiClient';
import authClient from './clients/authClient';

import { AuthProvider } from './lib/auth';
import { DataLoaderProvider } from './lib/dataLoader';
import { App } from './modules/App';
import { ApplicationBoundary } from './modules/Boundaries';

const MemoApp = memo(() => {
	const apiClientRef = useRef(null);
	if (apiClientRef.current === null) {
		apiClientRef.current = apiClient(authClient.getToken);
	}

	return (
		<AuthProvider client={authClient}>
			<DataLoaderProvider client={apiClientRef.current}>
				<App />
			</DataLoaderProvider>
		</AuthProvider>
	);
});

unstable_createRoot(document.querySelector('#root')).render(
	<StrictMode>
		<BrowserRouter>
			<ApplicationBoundary>
				<MemoApp />
			</ApplicationBoundary>
		</BrowserRouter>
	</StrictMode>,
);
