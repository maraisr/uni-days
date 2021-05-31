import { platform } from 'os';
import { readdir, lstat } from 'fs/promises';
import { resolve, relative } from 'path';
import { async_handler } from './helpers/async_handler.js';

/**
 * @typedef {import("@types/express").Application} ExpressApplication
 */

const route_handler = (_name, handle) => {
	return async_handler((req, res, next) => {
		return handle(req, res, next);
	});
};

/**
 * TODO
 * @param {ExpressApplication} app
 */
export const bootstrap = async (app) => {
	const routes = new Map();

	await visit_files('src/routes', (rel, abs) => {
		if (!/\.[tj]sx?$/.test(rel)) return;
		const name = rel
			.replace(/\.[tj]sx?$/, '')
			.replaceAll(/[\\/]+/g, '/')
			.replace(/(\/|^)\$/, '$1:');

		if (platform() === 'win32') routes.set(name, import(`file://${abs}`));
		else routes.set(name, import(abs));
	});

	for (const [route, handler] of routes.entries()) {
		const { default: handle, preflight = [] } = await handler;
		if (!handle)
			throw new Error(`Route ${route} requires a default export!`);

		app.use(`/${route}`, ...preflight, route_handler(route, handle));
	}
};

const visit_files = async (directory, visitor, base_directory = directory) => {
	for (const filename of await readdir(directory)) {
		const file = resolve(directory, filename);
		const stat = await lstat(file);

		if (stat.isDirectory()) visit_files(file, visitor, base_directory);
		else if (stat.isFile()) visitor(relative(base_directory, file), file);
	}
};
