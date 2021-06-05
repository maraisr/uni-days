import yup, { isSchema, object, NumberSchema } from 'yup';

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
 * @param {string?} type_error
 */
export const check = (
	schema,
	invalid_params_message = 'Invalid query parameters. Query parameters are not permitted.',
	type_error,
) => {
	schema = object()
		.noUnknown(true, invalid_params_message)
		.shape(
			Object.entries(schema).reduce(
				(obj, [key, value]) => ({
					...obj,
					[key]: type_error ? value.typeError(type_error) : value,
				}),
				{},
			),
		);

	if (!isSchema(schema)) throw Error('Schema isnt valid');

	return (cb) => (obj) =>
		schema.validateSync(cb?.(schema) ?? obj, {
			abortEarly: true,
			recursive: true,
			strict: true,
		});
};
