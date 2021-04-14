import { unstable_useDeferredValue, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useSearchTerm = () => {
	const [params] = useSearchParams();
	return unstable_useDeferredValue(params.get('q') ?? '');
};

export const useDebouncedSearchTerm = () => {
	const search = useSearchTerm();
	const [searchTerm, setSearchTerm] = useState(search);

	useEffect(() => {
		const tm = setTimeout(() => setSearchTerm(search), 300);
		return () => void clearTimeout(tm);
	}, [search]);

	return searchTerm;
};
