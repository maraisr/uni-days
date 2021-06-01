import knex from 'knex/knex.js';

/**
 * @typedef {import('knex/types/index.d.ts').QueryInterface} QueryInterface
 * @typedef {import('knex/types/index.d.ts').Knex} Knex
 */

/**
 * @type Knex
 */
export const database = knex({
	client: 'mysql2',
	pool: {
		min: 2,
		max: 20,
	},
	connection: {
		host: 'localhost',
		user: 'root',
		password: 'password',
		database: 'happiness',
	},
});

database.on('query', ({ sql }) => {
	console.log(`(SQL) ${sql}`);
});

/**
 * @returns {QueryInterface}
 */
export const rankings = () => database.table('rankings');

/**
 * @returns {QueryInterface}
 */
export const users = () => database.table('users');
