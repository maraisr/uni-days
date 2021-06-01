import express_jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import { parse } from '@lukeed/ms';

const SECRET = 'auWtBrLzs8YM4zunaUCbwJT4sHKQ@3uNv8jETyzUy.yMPGTXrZ'; // yeah make this come from an env-variable

export const expiry = parse('1d') / 1000; // in seconds

export const sign = (payload) =>
	jsonwebtoken.sign(payload, SECRET, {
		algorithm: 'HS256',
		expiresIn: expiry,
	});

export const jwt_middleware = (options) =>
	express_jwt({
		...options,
		secret: SECRET,
		algorithms: ['HS256'],
	});
