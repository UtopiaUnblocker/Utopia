/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import type { Request } from './AbstractMessage.js';
import type { ServerConfig } from './BareServer.js';
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
export interface BareRemote {
    host: string;
    port: number | string;
    path: string;
    protocol: string;
}
export type BareHeaders = Record<string, string | string[]>;
export declare function fetch(config: ServerConfig, request: Request, signal: AbortSignal, requestHeaders: BareHeaders, url: BareRemote): Promise<IncomingMessage>;
export declare function upgradeFetch(serverConfig: ServerConfig, request: Request, signal: AbortSignal, requestHeaders: BareHeaders, remote: BareRemote): Promise<[res: IncomingMessage, socket: Duplex, head: Buffer]>;
