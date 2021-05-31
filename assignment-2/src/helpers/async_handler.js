/**
 * @typedef {import("@types/express").Handler} Handler
 */

/**
 *
 * @param {Handler} handler
 * @returns {Handler}
 */
export const async_handler = (handler) => (req, res, next) => {
	const result = handler(req, res, next);
	if (result && 'then' in result) result.catch(next);
};
