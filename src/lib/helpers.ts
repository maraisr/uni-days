export const fetchWithThrow = async <T>(
	fetcher: ReturnType<typeof fetch>,
): Promise<T> => {
	const req = await fetcher;
	if (!req.ok || req.status < 200 || req.status > 400)
		throw new Error(await req.text());
	return req.json();
};

// Inspiration from https://stackoverflow.com/a/30651864/2609301
export const isIncreasingSequence = (numbers: number[]) => {
	const total = numbers.length;
	const [C, D] = numbers.reduce(
		(acc, item, i) => [acc[0] + (i + 1) * item, acc[1] + (i + 1 ** 2)],
		[0, 0] as [C: number, D: number],
	);

	const A = (total * (total + 1)) / 2;
	const B = numbers.reduce((acc, i) => acc + i, 0);

	return (total * C - A * B) / ((total * D - A) ^ 2) < 0;
};
