import * as React from 'react';
import { useDebouncedSearchTerm, useSearchTerm } from '../components/Search';

export default () => {
	const searchTerm = useSearchTerm();
	const searchTermD = useDebouncedSearchTerm();
	return (
		<h1>
			a: {searchTerm}
			<br />
			b: {searchTermD}
		</h1>
	);
};
