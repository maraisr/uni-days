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

export const useProcessedSearchTerm = () => {
	const searchTerm = useDebouncedSearchTerm();

	const returns: { year: string; countries: string[] } = {
		year: '',
		countries: [],
	};

	const searchTermMatches = searchTerm.match(
		/(?:(?<c>[a-z]+)\s?((?=and)and\s?(?<c2>[a-z]+))?\s?(?:in|for|at)?\s?)?(?<y>[0-9]{4})?/i,
	);
	if (searchTermMatches) {
		const { groups } = searchTermMatches;
		returns.countries = [groups.c, groups.c2].filter(Boolean);
		returns.year = groups.y;

		return returns;
	}

	return null;
};
