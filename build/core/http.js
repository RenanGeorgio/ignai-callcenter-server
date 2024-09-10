"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io_server = exports.io = exports.serverHttp = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const server_1 = __importDefault(require("../server"));
const serverHttp = http_1.default.createServer(server_1.default);
exports.serverHttp = serverHttp;
const io = new socket_io_1.Server(serverHttp, {
    cors: {
        origin: '*',
    },
    path: '/queue',
});
exports.io = io;
const io_server = new socket_io_1.Server(serverHttp, {
    cors: {
        origin: '*',
    },
    path: '/commands',
});
exports.io_server = io_server;
