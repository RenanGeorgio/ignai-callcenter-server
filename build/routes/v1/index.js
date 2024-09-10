"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const twilio_1 = __importDefault(require("twilio"));
const env_1 = __importDefault(require("../../config/env"));
const routes = (0, express_1.Router)();
// Token
const TokenController = __importStar(require("../../controllers/token-controller"));
// Call
const CallController = __importStar(require("../../controllers/call-controller"));
const IvrController = __importStar(require("../../controllers/ivr-controller"));
// Server
const server_1 = __importDefault(require("../../controllers/server"));
routes
    // ivr
    .post('/welcome', twilio_1.default.webhook(env_1.default.twilio.authToken), IvrController.goToWelcome)
    .post('/menu', twilio_1.default.webhook(env_1.default.twilio.authToken), IvrController.goToMenu)
    .post('/planets', twilio_1.default.webhook(env_1.default.twilio.authToken), IvrController.goToPlanets)
    // call
    .post('/token', TokenController.getToken)
    .post('/call', CallController.handleOutgoingCall)
    .post('/incoming', CallController.handleIncomingCall)
    .post('/goodbye', CallController.handleFinishCall)
    // Test Server
    .get('/server', server_1.default.status);
exports.default = routes;
/*
- validate: {Boolean} whether or not the middleware should validate the request
    came from Twilio.  Default true. If the request does not originate from
    Twilio, we will return a text body and a 403.  If there is no configured
    auth token and validate=true, this is an error condition, so we will return
    a 500.
    */ 
