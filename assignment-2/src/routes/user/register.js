import { ValidationError } from 'yup';
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

	try {
		await users().insert({
			email,
			password: hash(password), // hashing locally so we dont send plain-text over the wire to database
		});
	} catch (e) {
		if (e.code === 'ER_DUP_ENTRY') {
			res.status(409);
			throw new Error('User already exists');
		}
		console.error(e);
		throw new Error('Unknown error');
	}

	res.status(201);
	res.send({
		message: 'User created',
	});
};

export default handler;
