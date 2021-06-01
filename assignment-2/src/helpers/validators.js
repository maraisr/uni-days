import { string } from 'yup';

export const year = () =>
	string().matches(
		/^20[0-9]{2}$/,
		'Invalid year format. Format must be yyyy.',
	);

export const country = () =>
	string().matches(
		/^[^0-9]+$/,
		'Invalid country format. Country query parameter cannot contain numbers.',
	);

export const email = () => string().email();

export const password = () => string().trim().min(1);
