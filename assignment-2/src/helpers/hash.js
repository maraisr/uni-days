import { createHmac } from 'crypto';

const SECRET = 'wqvX!tfND7BJdizFjLfmvU-yjA!X!BUB_sNMmP.eT*zXhmVYBq'; // yeah make this come from an env-variable

/**
 * TODO
 * @param {string} payload
 * @returns {string}
 */
export const hash = (payload) =>
	createHmac('sha256', SECRET).update(payload).digest('hex');
