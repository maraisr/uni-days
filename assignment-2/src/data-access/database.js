const { knex } = knex_pkg;
import knex_pkg from 'knex/knex.js';

/**
 * @typedef {import('knex/types/index.d.ts').QueryInterface} QueryInterface
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

/**
 * @returns {QueryInterface}
 */
export const rankings = () => database.table('rankings');
