import tinydate from 'tinydate';
import { check } from '../../../helpers/validator.js';
import { jwt_middleware } from '../../../helpers/jwt.js';
import { date, email } from '../../../helpers/validators.js';
import { users } from '../../../data-access/database.js';
import { string } from 'yup';

const format_date = tinydate('{YYYY}-{MM}-{DD}');

/**
 * @typedef {import("@types/express").Handler} Handler
 */

const validator = check({
	email: email().required(),
})();

const put_validator = check(
	{
		firstName: string().required(
			'Request body incomplete: firstName, lastName, dob and address are required.',
		),
		lastName: string().required(
			'Request body incomplete: firstName, lastName, dob and address are required.',
		),
		address: string().required(
			'Request body incomplete: firstName, lastName, dob and address are required.',
		),
		dob: date(
			'Invalid input: dob must be a real date in format YYYY-MM-DD.',
		).required(
			'Request body incomplete: firstName, lastName, dob and address are required.',
		),
	},
	undefined,
	'Request body invalid, firstName, lastName and address must be strings only.',
)();

/**
 * TODO
 * @param {string} user_email
 * @param {string} owner_email
 */
const getUser = async (user_email, owner_email) => {
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
		.where('users.email', user_email);

	if (!user) return null;

	user.dob = user.dob ? format_date(user.dob) : null;

	return user;
};

/**
 * TODO
 * @type {Handler}
 */
const get = async (req, res) => {
	const { email } = validator(req.params);
	const { email: owner_email } = req?.user ?? {};

	const user = await getUser(email, owner_email);

	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}

	if (!owner_email || owner_email !== email) {
		// These will be null, but api surface should have these removed — sigh
		delete user.dob;
		delete user.address;
	}

	res.send(user);
};

/**
 * TODO
 * @type {Handler}
 */
const put = async (req, res) => {
	const { email } = validator(req.params);
	const body = put_validator(req.body);

	const { email: owner_email } = req.user;

	if (owner_email !== email) {
		res.status(403);
		throw new Error('Forbidden');
	}

	// No need to check if user exists
	// if a valid JWT exists, then the user will exist
	// if owner != email then we already fail.
	// so if owner == email then we know we have a user
	// NOTE; only time this will change is if an account is deleted after a token was served — but then the auth layer
	// (jwt_middleware) could feature add to include a test if user exists

	await users().update(body).where('email', owner_email);

	res.send(await getUser(email, owner_email));
};

export default {
	get: [
		jwt_middleware({
			credentialsRequired: false,
		}),
		get,
	],
	put: [jwt_middleware(), put],
};
