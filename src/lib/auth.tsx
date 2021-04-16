export interface AuthClient {
	isAuthenticated(): boolean;

	getToken(): string;

	login(username: string, password: string): Promise<string>;

	register(username: string, password: string): Promise<string>;

	logout(): boolean;
}

let currentAuthClient: AuthClient = null;

export const getCurrentAuthClient = () => currentAuthClient;
export const setAuthClient = (client: AuthClient) =>
	(currentAuthClient = client);

export const useAuth = () => getCurrentAuthClient();
