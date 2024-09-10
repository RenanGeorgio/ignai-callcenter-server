"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
const AuthApi = axios_1.default.create({
    baseURL: process.env.USER_CONTROLL,
    withCredentials: true,
    httpsAgent: new https_1.default.Agent({
        rejectUnauthorized: false
    })
});
exports.default = AuthApi;
