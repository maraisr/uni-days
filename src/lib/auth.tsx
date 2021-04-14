import type { ComponentType, FunctionComponent } from 'react';
import * as React from 'react';
import { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContext {
	isAuthenticated: boolean;
}

const context = createContext<AuthContext | null>(null);

const authClientCache = new WeakMap<any, AuthContext>();
export const AuthProvider: FunctionComponent = ({ children }) => {


	return (
		<context.Provider value={{ isAuthenticated: true }}>
			{children}
		</context.Provider>
	);
};

// Hooks

export const useAuth = () => useContext(context);

export const withRequiredAuthentication = <P extends unknown = {}>(
	Component: ComponentType<P>,
): FunctionComponent<P> => (props: P) => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/login');
		}
	}, [isAuthenticated]);

	return isAuthenticated ? (
		<Component {...props} />
	) : null;
};
