import { check } from '../helpers/validator.js';
import { rankings as rankings_table } from '../data-access/database.js';
import { string } from 'yup';

/**
 * @typedef {import("@types/express").Handler} Handler
 */

const rankings_validator = check(
	{
		year: string().matches(
			/^20[0-9]{2}$/,
			'Invalid year format. Format must be yyyy.',
		),
		country: string().matches(
			/[^0-9]/,
			'Invalid country format. Country query parameter cannot contain numbers.',
		),
	},
	'Invalid query parameters. Only year and country are permitted.',
);

const countries_validator = check({});

/**
 * TODO
 * @type {Handler}
 * */
export const rankings = async (req, res) => {
	const { year, country } = rankings_validator(req.query);

	const rankings = rankings_table().select(
		'rank',
		'country',
		'score',
		'year',
	);

	if (year) rankings.where('year', year);
	if (country) rankings.whereRaw('country like ?', country);

	res.send(await rankings);
};

/**
 * TODO
 * @type {Handler}
 * */
export const countries = async (req, res) => {
	countries_validator(req.query);

	const countries = await rankings_table().select('country');

	res.send(countries.map((row) => row.country));
};
