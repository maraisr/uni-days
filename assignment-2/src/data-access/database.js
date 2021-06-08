import knex from 'knex/knex.js';

/**
 * @typedef {import('knex/types/index.d.ts').QueryInterface} QueryInterface
 * @typedef {import('knex/types/index.d.ts').Knex} Knex
 */

/**
 * This is our main database connection client
 * @type Knex
 */
export const database = knex({
	client: 'mysql2',
	pool: {
		min: 2,
		max: 20,
	},
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
	},
});

/**
 * Gives access to the `Rankings` table.
 *
 * @returns {QueryInterface}
 */
export const rankings = () => database.table('rankings');

/**
 * Gives access to the `Users` table.
 *
 * @returns {QueryInterface}
 */
export const users = () => database.table('users');
