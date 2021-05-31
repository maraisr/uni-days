import { rankings as rankings_table } from '../data-access/database.js';
import { check } from '../helpers/validator.js';
import { country, year } from '../helpers/validators.js';

/**
 * @typedef {import("@types/express").Handler} Handler
 */

const validator = check(
	{
		year: year(),
		country: country(),
	},
	'Invalid query parameters. Only year and country are permitted.',
);
/**
 * TODO
 * @type {Handler}
 */
const handler = async (req, res, next) => {
	if (req.method !== 'GET') return next();

	const { year, country } = validator(req.query);

	const rankings = rankings_table()
		.select('rank', 'country', 'score', 'year')
		.orderBy('score', 'asc');

	if (year) rankings.where('year', year);
	if (country) rankings.whereRaw('country like ?', country);

	res.send(await rankings);
};

export default handler;
