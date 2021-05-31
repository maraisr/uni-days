import { ValidationError } from 'yup';
import { UnauthorizedError } from 'express-jwt';

/**
 * @typedef {import("@types/express").ErrorRequestHandler} ErrorHandler
 */

/**
 * TODO
 * @type {ErrorHandler}
 */
export const error_middleware = (error, req, res, next) => {
	if (res.headersSent) {
		return next(error);
	}

	if (res.statusCode === 200) res.status(500);

	if (error instanceof ValidationError) res.status(400);
	else if (error instanceof UnauthorizedError) {
		res.status(401);

		let message;
		switch (error.code) {
			case 'credentials_required': {
				message = "Authorization header ('Bearer token') not found";
				break;
			}
			case 'invalid_token':
			case 'revoked_token':
				message = 'Invalid JWT token';
				break;
			default:
				message = 'Authorization header is malformed';
				break;
		}

		if (error.inner.name === 'TokenExpiredError') {
			message = 'JWT token has expired';
		}

		res.send({
			error: true,
			message,
		});
		return;
	}
	res.send({
		error: true,
		message: error.message,
	});
};
