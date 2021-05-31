import { createHash } from 'crypto';

/**
 * TODO
 * @param {string} payload
 * @returns {string}
 */
export const hash = (payload) =>
	createHash('sha256').update(payload).digest('hex');
