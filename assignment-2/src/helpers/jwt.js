import express_jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import { parse } from '@lukeed/ms';

const SECRET = 'psal!camp0wirm-YARM'; // yeah make this come from an env-variable

export const expiry = parse('1d');

export const sign = (payload) =>
	jsonwebtoken.sign(payload, SECRET, {
		algorithm: 'HS256',
		expiresIn: expiry,
	});

export const jwt_middleware = express_jwt({
	secret: SECRET,
	algorithms: ['HS256'],
});
