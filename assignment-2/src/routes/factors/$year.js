import { number } from 'yup';

import { check } from '../../helpers/validator.js';
import { country, year } from '../../helpers/validators.js';
import { rankings as rankings_table } from '../../data-access/database.js';
import { jwt_middleware } from '../../helpers/jwt.js';

/**
 * @typedef {import("@types/express").Handler} Handler
 */

const params_validator = check({
	year: year(),
});

const query_validator = check(
	{
		country: country(),
		limit: number().positive().integer(),
	},
	'Invalid query parameters. Only limit and country are permitted.',
);

/**
 * TODO
 * @type {Handler[]}
 */
export const preflight = [jwt_middleware];

/**
 * TODO
 * @type {Handler}
 */
const handler = async (req, res, next) => {
	if (req.method !== 'GET') return next();

	const { year } = params_validator(req.params);
	const { limit, country } = query_validator(req.query);

	const factors = rankings_table()
		.select(
			'rank',
			'country',
			'score',
			'economy',
			'family',
			'health',
			'freedom',
			'generosity',
			'trust',
		)
		.orderBy('score', 'asc');

	if (year) factors.where('year', year);
	if (country) factors.whereRaw('country like ?', country);
	if (limit) factors.limit(limit);

	res.send(await factors);
};

export default handler;
