import tinydate from 'tinydate';
import { check } from '../../../helpers/validator.js';
import { jwt_middleware } from '../../../helpers/jwt.js';
import { email } from '../../../helpers/validators.js';
import { users } from '../../../data-access/database.js';

const format_date = tinydate('{YYYY}-{MM}-{DD}');

/**
 * @typedef {import("@types/express").Handler} Handler
 */

const validator = check({
	email: email(),
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
const put = (req, res, next) => {
	const { email } = validator(req.query);

	res.send({
		email,
	});
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
