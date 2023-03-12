/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { Request, Response } from './AbstractMessage.js';
import { EventEmitter } from 'node:events';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Duplex } from 'node:stream';
export interface BareErrorBody {
    code: string;
    id: string;
    message?: string;
    stack?: string;
}
export declare class BareError extends Error {
    status: number;
    body: BareErrorBody;
    constructor(status: number, body: BareErrorBody);
}
export declare const pkg: {
    version: string;
};
export declare function json<T>(status: number, json: T): Response;
export type BareMaintainer = {
    email?: string;
    website?: string;
};
export type BareProject = {
    name?: string;
    description?: string;
    email?: string;
    website?: string;
    repository?: string;
    version?: string;
};
export type BareLanguage = 'NodeJS' | 'ServiceWorker' | 'Deno' | 'Java' | 'PHP' | 'Rust' | 'C' | 'C++' | 'C#' | 'Ruby' | 'Go' | 'Crystal' | 'Shell' | string;
export type BareManifest = {
    maintainer?: BareMaintainer;
    project?: BareProject;
    versions: string[];
    language: BareLanguage;
    memoryUsage?: number;
};
export interface BareServerInit {
    logErrors?: boolean;
    localAddress?: string;
    maintainer?: BareMaintainer;
}
export interface ServerConfig {
    logErrors: boolean;
    localAddress?: string;
    maintainer?: BareMaintainer;
}
export default class Server extends EventEmitter {
    routes: Map<string, (serverConfig: ServerConfig, request: Request, response: ServerResponse<IncomingMessage>) => Promise<Response> | Response>;
    socketRoutes: Map<string, (serverConfig: ServerConfig, request: Request, socket: Duplex, head: Buffer) => Promise<void> | void>;
    private directory;
    private config;
    /**
     * Remove all timers and listeners
     */
    close(): void;
    shouldRoute(request: IncomingMessage): boolean;
    get instanceInfo(): BareManifest;
    routeUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer): Promise<void>;
    routeRequest(req: IncomingMessage, res: ServerResponse): Promise<void>;
}
