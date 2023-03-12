"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalizeHeaderName_1 = require("./utils/normalizeHeaderName");
const normalizeHeaderValue_1 = require("./utils/normalizeHeaderValue");
const NORMALIZED_HEADERS = Symbol('normalizedHeaders');
const RAW_HEADER_NAMES = Symbol('rawHeaderNames');
class HeadersPolyfill {
    // Normalized header {"name":"a, b"} storage.
    [NORMALIZED_HEADERS] = {};
    // Keeps the mapping between the raw header name
    // and the normalized header name to ease the lookup.
    [RAW_HEADER_NAMES] = new Map();
    constructor(init) {
        /**
         * @note Cannot check if the `init` is an instance of the `Headers`
         * because that class is only defined in the browser.
         */
        if (['Headers', 'HeadersPolyfill'].includes(init?.constructor.name) ||
            init instanceof HeadersPolyfill) {
            const initialHeaders = init;
            initialHeaders.forEach((value, name) => {
                this.append(name, value);
            }, this);
        }
        else if (Array.isArray(init)) {
            init.forEach(([name, value]) => {
                this.append(name, Array.isArray(value) ? value.join(', ') : value);
            });
        }
        else if (init) {
            Object.getOwnPropertyNames(init).forEach((name) => {
                const value = init[name];
                this.append(name, Array.isArray(value) ? value.join(', ') : value);
            });
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    *keys() {
        for (const name of Object.keys(this[NORMALIZED_HEADERS])) {
            yield name;
        }
    }
    *values() {
        for (const value of Object.values(this[NORMALIZED_HEADERS])) {
            yield value;
        }
    }
    *entries() {
        for (const name of Object.keys(this[NORMALIZED_HEADERS])) {
            yield [name, this.get(name)];
        }
    }
    /**
     * Returns a `ByteString` sequence of all the values of a header with a given name.
     */
    get(name) {
        return this[NORMALIZED_HEADERS][normalizeHeaderName_1.normalizeHeaderName(name)] || null;
    }
    /**
     * Sets a new value for an existing header inside a `Headers` object, or adds the header if it does not already exist.
     */
    set(name, value) {
        const normalizedName = normalizeHeaderName_1.normalizeHeaderName(name);
        this[NORMALIZED_HEADERS][normalizedName] = normalizeHeaderValue_1.normalizeHeaderValue(value);
        this[RAW_HEADER_NAMES].set(normalizedName, name);
    }
    /**
     * Appends a new value onto an existing header inside a `Headers` object, or adds the header if it does not already exist.
     */
    append(name, value) {
        const normalizedName = normalizeHeaderName_1.normalizeHeaderName(name);
        let resolvedValue = this.has(normalizedName)
            ? `${this.get(normalizedName)}, ${value}`
            : value;
        this.set(name, resolvedValue);
    }
    /**
     * Deletes a header from the `Headers` object.
     */
    delete(name) {
        if (!this.has(name)) {
            return;
        }
        const normalizedName = normalizeHeaderName_1.normalizeHeaderName(name);
        delete this[NORMALIZED_HEADERS][normalizedName];
        this[RAW_HEADER_NAMES].delete(normalizedName);
    }
    /**
     * Returns the object of all the normalized headers.
     */
    all() {
        return this[NORMALIZED_HEADERS];
    }
    /**
     * Returns the object of all the raw headers.
     */
    raw() {
        const rawHeaders = {};
        for (const [name, value] of this.entries()) {
            rawHeaders[this[RAW_HEADER_NAMES].get(name)] = value;
        }
        return rawHeaders;
    }
    /**
     * Returns a boolean stating whether a `Headers` object contains a certain header.
     */
    has(name) {
        return this[NORMALIZED_HEADERS].hasOwnProperty(normalizeHeaderName_1.normalizeHeaderName(name));
    }
    /**
     * Traverses the `Headers` object,
     * calling the given callback for each header.
     */
    forEach(callback, thisArg) {
        for (const name in this[NORMALIZED_HEADERS]) {
            if (this[NORMALIZED_HEADERS].hasOwnProperty(name)) {
                callback.call(thisArg, this[NORMALIZED_HEADERS][name], name, this);
            }
        }
    }
}
exports.default = HeadersPolyfill;
