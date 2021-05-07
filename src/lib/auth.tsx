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

export interface User {
	email: string;
}

// Marker; this may seem excessive, but the jsdoc is super helpful in IDE's

export interface AuthClient {
	/**
	 * Is the user logged in?
	 */
	isAuthenticated(): boolean;

	/**
	 * Get the token
	 */
	getToken(): string;

	/**
	 * Log a user in
	 */
	login(username: string, password: string): Promise<string>;

	/**
	 * Register the user
	 */
	register(username: string, password: string): Promise<string>;

	/**
	 * Logout
	 */
	logout(): boolean;
}

interface AuthState extends Omit<AuthClient, 'isAuthenticated'> {
	isAuthenticated: boolean;

	user?: User;
}

const context = createContext<AuthState | null>(null);

/**
 * Gives you access to the scoped auth client
 */
export const useAuth = () => useContext(context)!;

/**
 * Provides the application with auth functionality connected to React. The client _may_ be used without this provider
 * for direct access.
 */
export const AuthProvider: FunctionComponent<{ client: AuthClient }> = ({
	client,
	children,
}) => {
	const navigate = useNavigate();
	const [isAuthenticated, setIsAuthenticated] = useState(() =>
		client.isAuthenticated(),
	);
	const [user, setUser] = useState<User | undefined>(() => {
		if (isAuthenticated) {
			return getUserObjectFromJWT(client.getToken());
		}
		return undefined;
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
			return client.login(username, password).then((token) => {
				const isAuthed = client.isAuthenticated();
				setIsAuthenticated(isAuthed);
				if (isAuthed) {
					setUser(getUserObjectFromJWT(token));
				}
				return token;
			});
		},
		[client],
	);

	const value = useMemo<AuthState>(
		() => ({
			getToken: client.getToken,
			isAuthenticated,
			login,
			logout,
			register: client.register,
			user,
		}),
		[client, isAuthenticated, login, logout, user],
	);

	return <context.Provider value={value}>{children}</context.Provider>;
};

/**
 * Gets the "payload" from a jwt. I've opted here to simply decode myself, as opposed to crypto safe decode. Seeing as
 * this is public space data, we don't care if the user "messes with it", they will just be affecting their ui. The
 * token itself is still validated server side.
 */
const getUserObjectFromJWT = (token?: string) => {
	if (!token) return undefined;

	try {
		const encodedData = token.split('.')[1];
		const decodedData = atob(encodedData);
		const data = JSON.parse(decodedData);
		return {
			email: data.email,
		};
	} catch (e) {
		return undefined;
	}
};
