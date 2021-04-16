export const fetchWithThrow = async <T>(
	fetcher: ReturnType<typeof fetch>,
): Promise<T> => {
	const req = await fetcher;
	if (!req.ok || req.status < 200 || req.status > 400)
		throw new Error(await req.text());
	return req.json();
};
