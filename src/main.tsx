import * as React from 'react';
import { StrictMode } from 'react';
import { unstable_createRoot } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './App.global.css';
import apiClient from './clients/apiClient';
import authClient from './clients/authClient';
import { setAuthClient } from './lib/auth';
import { DataLoaderProvider } from './lib/dataLoader';
import { ApplicationBoundary } from './modules/Boundaries';

setAuthClient(authClient);

unstable_createRoot(document.querySelector('#root')).render(
	<StrictMode>
		<BrowserRouter>
			<ApplicationBoundary>
				<DataLoaderProvider client={apiClient}>
					<App />
				</DataLoaderProvider>
			</ApplicationBoundary>
		</BrowserRouter>
	</StrictMode>,
);
