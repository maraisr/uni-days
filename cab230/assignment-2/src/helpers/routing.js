import { lstat, readdir } from 'fs/promises';
import { relative, resolve } from 'path';
import { async_handler } from './async_handler.js';
import { pathToFileURL } from 'url';

/**
 * @typedef {import("@types/express").Handler} Handler
 */

/**
 * Returns an AsyncIterator of all paths to mount as routes. Passing in a path
 * to start collecting routes from.
 *
 * @param {string} path
 * @returns {AsyncGenerator<{route: string, handlers: Handler[], verb: ("get" | "post" | "put")}, void>}
 */
export async function* collect_routes_for(path) {
	const routes = new Map();

	// Recursively loop all folders.
	// NOTE; no `index.js` support, all routes are to be named.
	await visit_files(path, (rel, abs) => {
		if (!/\.[tj]sx?$/.test(rel)) return;
		const name = rel
			.replace(/\.[tj]sx?$/, '')
			.replaceAll(/[\\/]+/g, '/')
			.replace(/(\/|^)\$/, '$1:');

		routes.set(name, import(pathToFileURL(abs)));
	});

	for (const [route, handler] of routes.entries()) {
		const { default: handles } = await handler;
		if (!handles)
			throw new Error(`Route ${route} requires a default export!`);

		for (const [verb, handle] of Object.entries(handles)) {
			const mapped = (Array.isArray(handle) ? handle : [handle]).map(
				async_handler,
			);

			yield {
				route: `/${route}`,
				verb,
				handlers: mapped,
			};
		}
	}
}

const visit_files = async (directory, visitor, base_directory = directory) => {
	for (const filename of await readdir(directory)) {
		const file = resolve(directory, filename);
		const stat = await lstat(file);

		if (stat.isDirectory())
			await visit_files(file, visitor, base_directory);
		else if (stat.isFile()) visitor(relative(base_directory, file), file);
	}
};
