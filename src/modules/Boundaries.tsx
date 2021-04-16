import { AsyncBoundary } from 'async-boundary';
import type { FunctionComponent } from 'react';
import * as React from 'react';

const PageError = () => (
	<p>There seems to be a fatal error, please try again later.</p>
);
const FullPageLoader = () => <p>Loading...</p>;

export const ApplicationBoundary: FunctionComponent = ({ children }) => (
	<AsyncBoundary
		errorFallback={PageError}
		onError={console.error}
		fallback={<FullPageLoader />}
	>
		{children}
	</AsyncBoundary>
);
