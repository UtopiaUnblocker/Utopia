import { Headers } from 'headers-polyfill';
/**
 *
 * Splits headers according to spec
 * @param headers
 * @returns Split headers
 */
export declare function splitHeaders(headers: Headers): Headers;
/**
 * Joins headers according to spec
 * @param headers
 * @returns Joined headers
 */
export declare function joinHeaders(headers: Headers): Headers;
