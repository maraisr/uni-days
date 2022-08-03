import * as React from 'react';
import { StrictMode } from 'react';
import { unstable_createRoot } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import apiClient from './clients/apiClient';
import authClient from './clients/authClient';

import { AuthProvider } from './lib/auth';
import { DataLoaderProvider } from './lib/dataLoader';
import { App } from './modules/App';
import { ApplicationBoundary } from './modules/Boundaries';

const apiClientInstance = apiClient(authClient.getToken);

unstable_createRoot(document.querySelector('#root')).render(
	<StrictMode>
		<BrowserRouter>
			<ApplicationBoundary>
				<AuthProvider client={authClient}>
					<DataLoaderProvider client={apiClientInstance}>
						<App />
					</DataLoaderProvider>
				</AuthProvider>
			</ApplicationBoundary>
		</BrowserRouter>
	</StrictMode>,
);
