import * as React from 'react';
import { memo, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { Button } from '../modules/Button';
import { FormWrapper } from '../modules/FormWrapper';
import { PageFrame } from '../modules/PageFrame';

export default memo(() => {
	const { register } = useAuth();
	useEffect(() => {
		register('my-user3@test.com', 'password');
	}, []);

	return (
		<PageFrame>
			<FormWrapper>
				<h1>Register</h1>
				username: <input />
				<br />
				password: <input />
				<br />
				<Button>Create Account</Button>
			</FormWrapper>
		</PageFrame>
	);
});
