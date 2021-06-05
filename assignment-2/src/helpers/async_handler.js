/**
 * @typedef {import("@types/express").Handler} Handler
 */

/**
 * Express' default methods to deal with errors simply doesnt respect async/await.
 * This is a helper method that wraps a handler in an optional `.catch` that forwards
 * to the error middleware correctly.
 *
 * @param {Handler} handler
 * @returns {Handler}
 */
export const async_handler = (handler) => (req, res, next) => {
	const result = handler(req, res, next);
	if (result && 'then' in result) result.catch(next);
};
