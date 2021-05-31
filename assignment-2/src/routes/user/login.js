import { ValidationError } from 'yup';
import { expiry, sign } from '../../helpers/jwt.js';
import { check } from '../../helpers/validator.js';
import { email, password } from '../../helpers/validators.js';
import { users } from '../../data-access/database.js';
import { hash } from '../../helpers/hash.js';

/**
 * @typedef {import("@types/express").Handler} Handler
 */

const validator = check({});

const body_validator = check({
	email: email().required(),
	password: password().required(),
});

/**
 * TODO
 * @type {Handler}
 */
const handler = async (req, res, next) => {
	if (req.method !== 'POST') return next();

	validator(req.query);

	let email, password;

	try {
		const result = body_validator(req.body);
		email = result.email;
		password = result.password;
	} catch (e) {
		throw new ValidationError(
			'Request body incomplete, both email and password are required',
		);
	}

	const [user] = await users()
		.select('email')
		.where('email', email)
		.where('password', hash(password))
		.limit(1);

	if (!user) {
		res.status(401);
		throw new Error('Incorrect email or password');
	}

	const token = sign({
		email: user.email,
	});

	res.send({
		token,
		token_type: 'Bearer',
		expires_in: expiry,
	});
};

export default handler;
