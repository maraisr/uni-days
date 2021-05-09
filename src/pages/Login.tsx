import clsx from 'clsx';
import * as React from 'react';
import { memo, useCallback, useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { APP_TITLE, emailRegex } from '../consts';
import { useAuth } from '../lib/auth';
import { buttonStyles } from '../ui/Button';
import { FormField } from '../ui/FormField';
import { FormWrapper } from '../ui/FormWrapper';
import { PageFrame } from '../ui/PageFrame';
import formStyles from '../ui/styles/Form.module.css';

import styles from './styles/Login.module.css';

interface FormValues {
	username: string;
	password: string;
}

export default memo(() => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>();
	const [formError, setFormError] = useState(null);

	const submitHandler = useCallback<SubmitHandler<FormValues>>(
		({ username, password }) => {
			return login(username, password)
				.then(() => {
					navigate('/dashboard');
				})
				.catch((e) => {
					setFormError(e.message);
				});
		},
		[],
	);

	useEffect(() => {
		document.title = `Login | ${APP_TITLE}`;
	}, []);

	return (
		<PageFrame>
			<FormWrapper>
				<h1>Login</h1>
				{formError && (
					<p className={formStyles.formError}>{formError}</p>
				)}
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
							type="email"
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
							type="password"
						/>
					</FormField>
					<div className={styles.tail}>
						<input
							type="submit"
							className={buttonStyles}
							value="Login"
							disabled={isSubmitting}
						/>
						<div>
							<Link to="/register">Register new account</Link>
						</div>
					</div>
				</form>
			</FormWrapper>
		</PageFrame>
	);
});
