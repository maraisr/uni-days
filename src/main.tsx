import './App.global.css';

import * as React from 'react';
import { StrictMode } from 'react';
import { unstable_createRoot } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import apiClient from './apiClient';
import { App } from './App';
import { AuthProvider } from './lib/auth';
import { DataLoaderProvider } from './lib/dataLoader';
import { ApplicationBoundary } from './modules/Boundaries';

unstable_createRoot(document.querySelector('#root')).render(
	<StrictMode>
		<BrowserRouter>
			<ApplicationBoundary>
				<DataLoaderProvider apiClient={apiClient}>
					<AuthProvider>
						<App />
					</AuthProvider>
				</DataLoaderProvider>
			</ApplicationBoundary>
		</BrowserRouter>
	</StrictMode>,
);
