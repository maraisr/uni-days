import * as React from 'react';
import type { FunctionComponent } from 'react';
import { Header } from './Header';

export const Layout: FunctionComponent = ({ children }) => {
	return (
		<>
			<Header />
			<main>{children}</main>
		</>
	);
};
