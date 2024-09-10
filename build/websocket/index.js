"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("../core/http");
let users = [];
http_1.io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    http_1.io.sockets.emit('users', users);
    users.push({
        id: socket.id,
        username: socket.handshake.query.username,
    });
    socket.on('send', (data) => {
        console.log(data);
    });
    socket.on('connect_error', (error) => {
        console.log(error);
    });
    socket.on('disconnect', () => {
        for (var i = 0, len = users.length; i < len; ++i) {
            var user = users[i];
            if (user.id == socket.id) {
                users.splice(i, 1);
                break;
            }
        }
        http_1.io.sockets.emit('users', users);
    });
}));
