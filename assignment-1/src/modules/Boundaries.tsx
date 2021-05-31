import { AsyncBoundary } from 'async-boundary';
import type { FunctionComponent } from 'react';
import * as React from 'react';

const PageError = () => (
	<p>There seems to be a fatal error, please try again later.</p>
);
const FullPageLoader = () => <p>Loading...</p>;

// A special async-boundary that is a "everything" failed, no other boundaries caught the error so we fail to this.
// Avoids the "white" screen if something breaks.
export const ApplicationBoundary: FunctionComponent = ({ children }) => (
	<AsyncBoundary
		errorFallback={PageError}
		onError={console.error}
		fallback={<FullPageLoader />}
	>
		{children}
	</AsyncBoundary>
);
