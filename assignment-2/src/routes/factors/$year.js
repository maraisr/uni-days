import { string } from 'yup';

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
		limit: string()
			.test({
				name: 'is_valid',
				message:
					'Invalid limit query. Limit must be a positive number.',
				test: (value) => {
					return value ? /^[0-9]+$/.test(value) : true;
				},
			})
			.notRequired(),
	},
	'Invalid query parameters. Only limit and country are permitted.',
	undefined,
);

/**
 * @type {Handler}
 */
const handler = async (req, res, next) => {
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
		.orderBy('year', 'desc')
		.orderBy('rank', 'asc');

	if (year) factors.where('year', year);
	if (country) factors.whereRaw('country like ?', country);
	if (limit) factors.limit(limit);

	res.send(await factors);
};

export default {
	get: [jwt_middleware(), handler],
};
