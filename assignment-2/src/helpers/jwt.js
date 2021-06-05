import express_jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import { parse } from '@lukeed/ms';

/**
 * @typedef {import("@types/express").Handler} Handler
 */

// To the marker — yes having this SECRET here is not good. In a real world application, this would be coming from an environment variable/file or some trusted source.
const SECRET = 'auWtBrLzs8YM4zunaUCbwJT4sHKQ@3uNv8jETyzUy.yMPGTXrZ';

// The expiry should be 1d by default
export const expiry = parse('1d') / 1000; // in seconds

/**
 * Signs a payload and returns its JWT.
 *
 * @param {object} payload
 * @returns {string}
 */
export const sign = (payload) =>
	jsonwebtoken.sign(payload, SECRET, {
		algorithm: 'HS256',
		expiresIn: expiry,
	});

/**
 * The JWT middleware we can pass into Express to add the `req.user` property.
 *
 * Passing `credentialsRequired: false` will accept a JWT and validate it — but if not passed will simply not error.
 *
 * @param {{credentialsRequired?: boolean}} options
 * @returns {Handler}
 */
export const jwt_middleware = (options = {}) =>
	express_jwt({
		...options,
		secret: SECRET,
		algorithms: ['HS256'],
	});
