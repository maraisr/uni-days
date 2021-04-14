import type { FunctionComponent } from 'react';
import * as React from 'react';
import {
	ContextType,
	createContext,
	useContext,
	useMemo,
	useState,
} from 'react';

type Cache = Map<string, any>;

const context = createContext<{
	cache: Cache;
	api: Record<string, (params: any) => Promise<any>>;
} | null>(null);
type ContextValue = ContextType<typeof context>;

export interface ApiClients {
	[endpoint: string]: (params: any) => Promise<any>;
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
	apiClient: ApiClients;
}> = ({ children, apiClient }) => {
	const [cache] = useState(() => new Map());

	const value = useMemo(() => {
		return {
			cache,
			api: apiClient,
		};
	}, [apiClient, cache]);

	return <context.Provider value={value}>{children}</context.Provider>;
};

const readLoader = (
	loader: LoaderDefinition,
	params: any,
	context: ContextValue,
) => {
	const key = `${loader.family}~${loader.getKey(params)}`;
	const probe = context.cache.get(key);

	if (probe !== undefined) {
		if (typeof probe.then === 'function') throw probe;
		return probe;
	}

	// TODO: Try and re-use existing in-flight loaders
	const networkPromise = loader.getData(params, context.api);
	if (networkPromise === null) {
		context.cache.set(key, null);
		return null;
	}

	let promise = Array.isArray(networkPromise)
		? Promise.all(networkPromise).then((data) => data.flat())
		: networkPromise;

	promise
		.then((data) => {
			context.cache.set(key, data);
		})
		.catch((e) => {
			throw e;
		});

	context.cache.set(key, promise);

	throw promise;
};

export const useDataLoader = <T extends LoaderDefinition>(
	loader: T,
	params: T extends LoaderDefinition<infer U, any> ? U : never,
) => {
	const cache = useContext(context)!;
	return readLoader(loader, params, cache);
};
