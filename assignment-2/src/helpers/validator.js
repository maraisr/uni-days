import { isSchema, object } from 'yup';

/**
 * @typedef {import('yup').AnySchema} ValidationSchema
 * @typedef {import('yup').ValidationError} ValidationError
 */

/**
 * TODO
 */
/*export class ValidatorError extends Error {
	/!**
	 * @param {ValidationError} errors
	 *!/
	constructor(errors) {
		// We only care about the first one for the response;
		const [error] = errors;
		super(error.message);
	}
}*/

/**
 * TODO
 * @param {ValidationSchema} schema
 * @param {string?} invalid_params_message
 */
export const check = (
	schema,
	invalid_params_message = 'Invalid query parameters. Query parameters are not permitted.',
) => {
	schema = object().noUnknown(true, invalid_params_message).shape(schema);

	if (!isSchema(schema)) throw Error('Schema isnt valid');

	return (obj /** @type {object} */) => {
		const c = schema.cast(obj, { assert: false, stripUnknown: false });
		return schema.validateSync(c, {
			abortEarly: true,
			strict: true,
		});
	};
};
