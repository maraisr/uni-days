/**
 * This file houses the dataLoader a mechanism that enables fetch, or REST style apis to share their promises with
 * sibling's enabling minimal network traffic and caching. Currently only families will have their responses cached,
 * but not the underlying transport.
 *
 * There are hopes in the near future for this to facilitate request sharing, caching eviction and so on. But
 * ultimately we should aim for a normalized store such that 2 different families can ask the store for a ranking of
 * year+country, and if that data is in the store maybe from another family, to return it. This does mean that
 * components are reference tracked and updated when pieces of information changes. But that journey is far to involved
 * for an assessment like this.
 */

import type { FunctionComponent } from 'react';
import * as React from 'react';
import { ContextType, createContext, useContext, useRef } from 'react';

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
	/**
	 * The family this loader belongs to.
	 */
	family: string;

	/**
	 * The key, or think of this as the member within that family.
	 */
	getKey(params: P): string;

	/**
	 * Instrumenting the transport.
	 */
	getData(params: P, api: ApiClients): Promise<Result> | Promise<Result>[];
}

interface LoaderFn {
	<P = any, Result = unknown>(
		config: LoaderDefinition<P, Result>,
	): LoaderDefinition<P, Result>;
}

export const defineLoader: LoaderFn = (config) => config;

/**
 * Configures and sets up an api cache boundary.
 */
export const DataLoaderProvider: FunctionComponent<{
	client: ApiClients;
}> = ({ children, client }) => {
	const value = useRef<ContextValue>(null);

	if (value.current === null || value.current.api !== client) {
		value.current = {
			cache: new Map(),
			api: client,
		};
	}

	return (
		<context.Provider value={value.current}>{children}</context.Provider>
	);
};

export const useApiClient = () => useContext(context)!;

/**
 * Reads an inflight resolved value, or throws a promise. This function is more bound to React ways of doing things,
 * particularly around suspense for data fetching.
 */
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

/**
 * Reads data from a loader hooked up to variables, this hook will suspend.
 */
export const useDataLoader = <T extends LoaderDefinition>(
	loader: T,
	params?: T extends LoaderDefinition<infer U, any> ? U : never,
) => readLoader(loader, params, useApiClient());
