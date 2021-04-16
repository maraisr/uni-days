import type { FunctionComponent } from 'react';
import * as React from 'react';
import { createContext, useContext } from 'react';

// check https://github.com/auth0/auth0-spa-js/blob/e4b04f3f74fd54e5ed27bc48e01ba03c6655667d/src/cache.ts#L134

interface AuthContext {
	isAuthenticated: boolean;
}

interface AuthClient {
	isAuthenticated(): boolean;

	getToken(): Promise<string>;

	login(username: string, password: string): Promise<boolean>;

	logout(): boolean;

	register(username: string, password: string): Promise<boolean>;
}

const context = createContext<AuthContext | null>(null);

export const AuthProvider: FunctionComponent = ({ children }) => {
	return (
		<context.Provider value={{ isAuthenticated: true }}>
			{children}
		</context.Provider>
	);
};

// Hooks

export const useAuth = () => useContext(context);
