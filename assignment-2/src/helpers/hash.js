import { createHmac } from 'crypto';

// To the marker — yes having this SECRET here is not good. In a real world application, this would be coming from an environment variable/file or some trusted source.
const SECRET = 'wqvX!tfND7BJdizFjLfmvU-yjA!X!BUB_sNMmP.eT*zXhmVYBq';

/**
 * A utility to cryptographically secure hashing of strings. Hashing into HEX
 *
 * @param {string} payload
 * @returns {string}
 */
export const hash = (payload) =>
	createHmac('sha256', SECRET).update(payload).digest('hex');
