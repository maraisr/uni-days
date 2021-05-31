import { loaders } from '../data-access/loaders.js';
import { check } from '../helpers/validator.js';
import { rankings as rankings_table } from '../data-access/database.js';
import { number, string } from 'yup';

/**
 * @typedef {import("@types/express").Handler} Handler
 */

const validator = check({
	year: string().matches(/^20[1-9]{2}$/, 'Invalid year format. Format must be yyyy.'),
	country: string().matches(/[^0-9]/, 'Invalid country format. Country query parameter cannot contain numbers.'),
});

/**
 * The Rankings handler
 *
 * @type {Handler}
 * */
export const rankings = async (req, res) => {
	let { year, country } = validator(req.query);

	let rankings_ids = rankings_table().select('ID');

	if (year) rankings_ids.where('year', year);
	if (country) rankings_ids.whereRaw('country like ?', country);

	rankings_ids = await rankings_ids;

	res.send(await loaders.rankings.loadMany(rankings_ids.map(row => row.ID)));
};
