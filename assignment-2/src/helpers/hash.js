import { createHmac } from 'crypto';

const SECRET = 'wors!heek8loc7THAD';

/**
 * TODO
 * @param {string} payload
 * @returns {string}
 */
export const hash = (payload) =>
	createHmac('sha256', SECRET).update(payload).digest('hex');
