/**
 * A function that will cause non 200 series responses to throw exceptions.
 */
export const fetchWithThrow = async <T>(
	fetcher: ReturnType<typeof fetch>,
): Promise<T> => {
	const req = await fetcher;
	if (!req.ok || req.status < 200 || req.status > 400) {
		let error = 'Something bad happened';
		try {
			const maybeError = await req.json();
			if (maybeError.error && maybeError.message) {
				error = maybeError.message;
			}
		} catch (e) {
			error = await req.text();
		}
		throw new FetchError(error);
	}
	return req.json();
};

type FetchParams = Parameters<typeof fetch>;
/**
 * A method that wraps `fetch` but times the fetch out, aborting it.
 */
export const timeoutFetch = async (
	input: FetchParams[0],
	init?: FetchParams[1],
	timeout: number = 5e3,
): Promise<any> => {
	const abort = new AbortController();
	const timeoutTracker = setTimeout(() => {
		abort.abort();
	}, timeout);

	return fetch(input, {
		...init,
		signal: abort.signal,
	}).then((r) => {
		timeoutTracker && clearTimeout(timeoutTracker);
		return r;
	});
};

/**
 * A wrapper error instance with a new name, so we know which errors are "remote" vs other errors.
 *
 * @example
 *
 * if (error instanceof FetchError) console.log('remote error');
 */
export class FetchError extends Error {}

/**
 * A function that will tell you if a sequence of numbers are trending up (true for up, false for down)
 *
 * Algorithm inspired by @see https://stackoverflow.com/a/30651864/2609301
 */
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
