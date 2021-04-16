import * as React from 'react';
import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button } from '../modules/Button';
import { FormWrapper } from '../modules/FormWrapper';
import { PageFrame } from '../modules/PageFrame';

export default memo(() => {
	const { login } = useAuth();
	useEffect(() => {
		login('my-user3@test.com', 'password');
	}, []);

	return (
		<PageFrame>
			<FormWrapper>
				<h1>Login</h1>
				username: <input />
				<br />
				password: <input />
				<br />
				<Button>Login</Button>
				<br />
				<Link to="/register">Register new account</Link>
			</FormWrapper>
		</PageFrame>
	);
});
