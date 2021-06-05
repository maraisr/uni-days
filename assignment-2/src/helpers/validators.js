import { mixed, string } from 'yup';
import { isPast, isValid, parseISO } from 'date-fns';

export const year = () =>
	string().matches(/^[0-9]{4}$/, 'Invalid year format. Format must be yyyy.');

export const country = () =>
	string().matches(
		/^[^0-9]+$/,
		'Invalid country format. Country query parameter cannot contain numbers.',
	);

export const email = () => string().email();

export const password = () => string().trim().min(1);

export const date = (fallback_message) =>
	mixed()
		.test({
			name: 'date_valid',
			message: fallback_message,
			test(value, { originalValue }) {
				//return originalValue.length < 11 && isValid(parseISO(value));
				return isValid(parseISO(value));
			},
		})
		.test({
			name: 'is_past',
			message: 'Invalid input: dob must be a date in the past.',
			test: (value) => isPast(parseISO(value)),
		});
