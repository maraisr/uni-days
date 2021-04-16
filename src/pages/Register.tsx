import * as React from 'react';
import { memo } from 'react';
import { Button } from '../modules/Button';
import { FormWrapper } from '../modules/FormWrapper';
import { PageFrame } from '../modules/PageFrame';

export default memo(() => {
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
