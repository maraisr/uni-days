import type { FunctionComponent } from 'react';
import * as React from 'react';
import { ContextType, createContext, useContext, useMemo } from 'react';

type Cache = Map<string, any>;

const context = createContext<{
	cache: Cache;
	api: Record<string, (params: any) => Promise<any>>;
} | null>(null);
type ContextValue = ContextType<typeof context>;

export interface ApiClients {
	[endpoint: string]: (params?: any) => Promise<any>;
}

interface LoaderDefinition<P = any, Result = unknown> {
	family: string;

	getKey(params: P): string;

	getData(params: P, api: ApiClients): Promise<Result> | Promise<Result>[];
}

interface LoaderFn {
	<P = any, Result = unknown>(
		config: LoaderDefinition<P, Result>,
	): LoaderDefinition<P, Result>;
}

export const defineLoader: LoaderFn = (config) => config;

export const DataLoaderProvider: FunctionComponent<{
	client: ApiClients;
}> = ({ children, client }) => {
	const value = useMemo(() => {
		return {
			cache: new Map(),
			api: client,
		};
	}, [client]);

	return <context.Provider value={value}>{children}</context.Provider>;
};

const readLoader = <T extends LoaderDefinition>(
	loader: T,
	params: any,
	context: ContextValue,
): T extends LoaderDefinition<any, infer U> ? U : never => {
	const key = `${loader.family}~${loader.getKey(params)}`;

	const cachedValue = context.cache.get(key);

	if (cachedValue !== undefined) {
		if (typeof cachedValue.then === 'function') throw cachedValue;
		if (cachedValue instanceof Error) throw cachedValue;
		return cachedValue;
	}

	const networkPromise = loader.getData(params, context.api);

	const promise = Array.isArray(networkPromise)
		? Promise.all(networkPromise).then((data) => data.flat())
		: networkPromise;

	promise
		.then((data) => {
			context.cache.set(key, data);
		})
		.catch((error) => {
			context.cache.set(key, error);
		});
	context.cache.set(key, promise);

	throw promise;
};

export const useDataLoader = <T extends LoaderDefinition>(
	loader: T,
	params?: T extends LoaderDefinition<infer U, any> ? U : never,
) => {
	const contextValue = useContext(context)!;
	return readLoader(loader, params, contextValue);
};
