import { rankings as rankings_table } from '../data-access/database.js';
import { check } from '../helpers/validator.js';

/**
 * @typedef {import("@types/express").Handler} Handler
 */

const validator = check({})();

/**
 * TODO
 * @type {Handler}
 */
const handler = async (req, res, next) => {
	validator(req.query);

	const countries = await rankings_table()
		.select('country')
		.distinct()
		.orderBy('country', 'asc');

	res.send(countries.map((row) => row.country));
};

export default {
	get: handler,
};
