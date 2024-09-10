"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mail = exports.AuthApi = void 0;
const auth_1 = __importDefault(require("./auth"));
exports.AuthApi = auth_1.default;
const mail_1 = __importDefault(require("./mail"));
exports.mail = mail_1.default;
