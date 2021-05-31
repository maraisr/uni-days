import { Router } from 'express';
import { rankings } from './routes/data.js';
import { async_handler } from './helpers/async_handler.js';

/**
 * @typedef {import("@types/express").Application} ExpressApplication
 */

const public_router = new Router({
	caseSensitive: true,
	strict: true,
});
const private_router = new Router({
	caseSensitive: true,
	strict: true,
});

// ~> Routes

public_router.get('/rankings', async_handler(rankings));

/**
 * TODO
 * @param {ExpressApplication} app
 */
export const bootstrap = (app) => {
	app.use(public_router, private_router);
};
