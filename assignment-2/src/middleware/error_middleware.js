import { ValidationError } from 'yup';

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

	if (error instanceof ValidationError) res.status(400);
	else res.status(500);

	res.send({
		error: true,
		message: error.message,
	});
};
