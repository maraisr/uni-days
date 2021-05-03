import type { FunctionComponent } from 'react';
import * as React from 'react';
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

export interface AuthClient {
	isAuthenticated(): boolean;

	getToken(): string;

	login(username: string, password: string): Promise<string>;

	register(username: string, password: string): Promise<string>;

	logout(): boolean;
}

interface AuthState extends Omit<AuthClient, 'isAuthenticated'> {
	isAuthenticated: boolean;
}

const context = createContext<AuthState | null>(null);

export const useAuth = () => useContext(context)!;

export const AuthProvider: FunctionComponent<{ client: AuthClient }> = ({
	client,
	children,
}) => {
	const navigate = useNavigate();
	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		return client.isAuthenticated();
	});

	const logout = useCallback(() => {
		const probe = client.logout();
		if (probe) {
			navigate('/dashboard');
			return true;
		}
		return false;
	}, [client]);

	const login = useCallback(
		(username: string, password: string) => {
			return client.login(username, password).then((returns) => {
				setIsAuthenticated(client.isAuthenticated());
				return returns;
			});
		},
		[client],
	);

	const value = useMemo<AuthState>(() => {
		return {
			login,
			logout,
			getToken: client.getToken,
			register: client.register,
			isAuthenticated,
		};
	}, [isAuthenticated, login, logout, client]);

	return <context.Provider value={value}>{children}</context.Provider>;
};
