/**
 * @typedef {import("@types/express").Handler} Handler
 */

/**
 * TODO
 * @type {Handler}
 */
export const accepts = (req, res, next) => {
	if (!req.accepts('application/json')) return void res.end(406);

	next();
};
