/// <reference types="node" />
/// <reference types="node" />
import type { BareHeaders } from './requestUtil.js';
import { Headers } from 'headers-polyfill';
import type { IncomingMessage, ServerResponse } from 'node:http';
export interface RequestInit {
    method: string;
    path: string;
    headers: Headers | BareHeaders;
}
/**
 * Abstraction for the data read from IncomingMessage
 */
export declare class Request {
    body: IncomingMessage;
    method: string;
    headers: Headers;
    url: URL;
    constructor(body: IncomingMessage, init: RequestInit);
    get query(): URLSearchParams;
}
export type ResponseBody = Buffer | IncomingMessage;
export interface ResponseInit {
    headers?: Headers | BareHeaders;
    status?: number;
    statusText?: string;
}
export declare class Response {
    body?: ResponseBody;
    status: number;
    statusText?: string;
    headers: Headers;
    constructor(body: ResponseBody | undefined, init?: ResponseInit);
}
export declare function writeResponse(response: Response, res: ServerResponse): boolean;
