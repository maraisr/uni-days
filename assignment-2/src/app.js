import { async_handler } from './helpers/async_handler.js';

import { platform } from 'os';
import { totalist } from 'totalist';

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

	await totalist('src/routes', (rel, abs) => {
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
