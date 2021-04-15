import type { FunctionComponent } from 'react';
import * as React from 'react';
import { createContext, useContext } from 'react';

interface AuthContext {
	isAuthenticated: boolean;
}

const context = createContext<AuthContext | null>(null);

export const AuthProvider: FunctionComponent = ({ children }) => {
	return (
		<context.Provider value={{ isAuthenticated: false }}>
			{children}
		</context.Provider>
	);
};

// Hooks

export const useAuth = () => useContext(context);
