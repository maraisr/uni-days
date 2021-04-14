import { AsyncBoundary as AsyncBoundaryImpl } from 'async-boundary';
import type { FunctionComponent } from 'react';
import * as React from 'react';

const PageError = () => <p>There seems to be a fatal error, please try again later.</p>
const FullPageLoader = () => <p>Loading...</p>

export const ApplicationBoundary:FunctionComponent = ({children}) => <AsyncBoundaryImpl errorFallback={PageError} fallback={<FullPageLoader />}>
	{children}
</AsyncBoundaryImpl>;

export const AsyncBoundary = AsyncBoundaryImpl;
