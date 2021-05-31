import type { FunctionComponent } from 'react';
import * as React from 'react';
import { Header } from './Header';

export const Layout: FunctionComponent = ({ children }) => (
	<>
		<Header />
		<main>{children}</main>
	</>
);
