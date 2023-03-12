import type { BareHeaders } from './requestUtil.js';
export declare function objectFromRawHeaders(raw: string[]): BareHeaders;
export declare function rawHeaderNames(raw: string[]): string[];
export declare function mapHeadersFromArray(from: string[], to: BareHeaders): BareHeaders;
/**
 * Converts a header into an HTTP-ready comma joined header.
 */
export declare function flattenHeader(value: string | string[]): string;
