export const collectTerms = (searchTerm: string) => {
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
