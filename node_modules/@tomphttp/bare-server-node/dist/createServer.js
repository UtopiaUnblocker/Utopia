"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const BareServer_js_1 = __importDefault(require("./BareServer.js"));
const V1_js_1 = __importDefault(require("./V1.js"));
const V2_js_1 = __importDefault(require("./V2.js"));
module.exports = function createBareServer(directory, init = {}) {
    const server = new BareServer_js_1.default(directory, init);
    (0, V1_js_1.default)(server);
    (0, V2_js_1.default)(server);
    return server;
};
//# sourceMappingURL=createServer.js.map