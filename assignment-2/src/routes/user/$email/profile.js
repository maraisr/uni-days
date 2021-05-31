import tinydate from 'tinydate';
import { check } from '../../../helpers/validator.js';
import { jwt_middleware } from '../../../helpers/jwt.js';
import { email } from '../../../helpers/validators.js';
import { users } from '../../../data-access/database.js';
import { date, string } from 'yup';

const format_date = tinydate('{YYYY}-{MM}-{DD}');

/**
 * @typedef {import("@types/express").Handler} Handler
 */

const validator = check({
	email: email().required(),
});

const put_validator = check({
	email: string(
		'Request body invalid, firstName, lastName and address must be strings only.',
	)
		.email()
		.required(
			'Request body incomplete: firstName, lastName, dob and address are required.',
		),
	firstName: string(
		'Request body invalid, firstName, lastName and address must be strings only.',
	).required(
		'Request body incomplete: firstName, lastName, dob and address are required.',
	),
	lastName: string(
		'Request body invalid, firstName, lastName and address must be strings only.',
	).required(
		'Request body incomplete: firstName, lastName, dob and address are required.',
	),
	dob: date('Invalid input: dob must be a real date in format YYYY-MM-DD.')
		.max(new Date(), 'Invalid input: dob must be a date in the past.')
		.required(
			'Request body incomplete: firstName, lastName, dob and address are required.',
		),
	address: string(
		'Request body invalid, firstName, lastName and address must be strings only.',
	).required(
		'Request body incomplete: firstName, lastName, dob and address are required.',
	),
});

/**
 * TODO
 * @type {Handler[]}
 */
export const preflight = [jwt_middleware()];

/**
 * TODO
 * @type {Handler}
 */
const get = async (req, res, next) => {
	const { email } = validator(req.params);
	const { email: owner_email } = req.user;

	const [user] = await users()
		.select(
			'users.email',
			'users.firstName',
			'users.lastName',
			'owner.dob',
			'owner.address',
		)
		.leftJoin('users as owner', (builder) => {
			builder
				.on('users.ID', 'owner.ID')
				.andOnVal('owner.email', '=', owner_email);
		})
		.where('users.email', email);

	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}

	user.dob = user.dob ? format_date(user.dob) : null;

	res.send(user);
};

/**
 * TODO
 * @type {Handler}
 */
const put = async (req, res, next) => {
	const { email } = validator(req.params);
	const body = put_validator(req.body);

	const { email: owner_email } = req.user;

	// email must be registered

	if (owner_email !== email) {
		res.status(403);
		throw new Error('Forbidden');
	}

	await users().update(body).where('email', owner_email);

	body.dob = body.dob ? format_date(body.dob) : null;

	delete body.email;

	res.send(body);
};

/**
 * TODO
 * @type {Handler}
 */
const handler = async (req, res, next) => {
	if (req.method === 'GET') return get(req, res, next);
	if (req.method === 'PUT') return put(req, res, next);

	return next();
};

export default handler;
