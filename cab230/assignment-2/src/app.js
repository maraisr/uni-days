import { readFile } from 'fs/promises';
import { parse, resolve } from 'path';
import swaggerUI from 'swagger-ui-express';
import { collect_routes_for } from './helpers/routing.js';
import { fileURLToPath } from 'url';

/**
 * @typedef {import("@types/express").Application} ExpressApplication
 */

/**
 * Bootstrap our application. This is purely "consumer" code and builds out the application.
 *
 * @param {ExpressApplication} app
 */
export const bootstrap = async (app) => {
	const doc = JSON.parse(await readFile('./data/swagger.json', 'utf8'));

	app.use(swaggerUI.serve);
	app.get('/', swaggerUI.setup(doc));

	const routes_folder = resolve(
		parse(fileURLToPath(import.meta.url)).dir,
		'routes',
	);

	for await (const { route, verb, handlers } of collect_routes_for(
		routes_folder,
	)) {
		app[verb](route, ...handlers);
	}
};
