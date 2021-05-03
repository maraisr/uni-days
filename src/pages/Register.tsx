import clsx from 'clsx';
import * as React from 'react';
import { memo, useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { APP_TITLE, emailRegex } from '../consts';
import { useAuth } from '../lib/auth';
import { buttonStyles } from '../ui/Button';
import { FormField } from '../ui/FormField';
import { FormWrapper } from '../ui/FormWrapper';
import { PageFrame } from '../ui/PageFrame';
import formStyles from '../ui/styles/Form.module.css';

import styles from './styles/Register.module.css';

interface FormValues {
	username: string;
	password: string;
}

export default memo(() => {
	const { register: authRegister } = useAuth();
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>();
	const [formError, setFormError] = useState(null);
	const [success, setSuccess] = useState(false);

	const submitHandler = useCallback<SubmitHandler<FormValues>>(
		({ username, password }) => {
			return authRegister(username, password)
				.then(() => {
					setSuccess(true);
					setFormError(null);
				})
				.catch((e) => {
					setFormError(e.message);
				});
		},
		[],
	);

	useEffect(() => {
		document.title = `Register | ${APP_TITLE}`;
	}, []);

	return (
		<PageFrame>
			<FormWrapper>
				<h1>Register</h1>
				{formError && (
					<p className={formStyles.formError}>{formError}</p>
				)}
				{success ? (
					<p className={styles.success}>
						Account successfully created, please{' '}
						<Link to="/login">login.</Link>
					</p>
				) : (
					<form
						onSubmit={handleSubmit(submitHandler)}
						className={clsx(styles.form, formStyles.form)}
					>
						<FormField
							id="username"
							label="Username"
							errors={errors.username?.message}
						>
							<input
								id="username"
								{...register('username', {
									required: true,
									validate(v) {
										return emailRegex.test(v)
											? null
											: 'Email not valid';
									},
								})}
							/>
						</FormField>
						<FormField
							id="password"
							label="Passsword"
							errors={errors.password?.message}
						>
							<input
								id="password"
								{...register('password', {
									required: true,
									minLength: 3,
								})}
							/>
						</FormField>
						<input
							type="submit"
							className={buttonStyles}
							value="Create Account"
							disabled={isSubmitting}
						/>
					</form>
				)}
			</FormWrapper>
		</PageFrame>
	);
});
