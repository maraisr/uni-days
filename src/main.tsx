import * as React from 'react';
import { StrictMode } from 'react';
import { unstable_createRoot } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './App.global.css';
import { AuthProvider } from './lib/auth';
import { ApplicationBoundary } from './modules/Boundaries';

unstable_createRoot(document.querySelector('#root')).render(
	<StrictMode>
		<BrowserRouter>
			<ApplicationBoundary>
				<AuthProvider>
					<App />
				</AuthProvider>
			</ApplicationBoundary>
		</BrowserRouter>
	</StrictMode>,
);
