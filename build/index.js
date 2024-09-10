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
require("express-async-errors");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const env_1 = __importDefault(require("./config/env"));
const http_1 = require("./core/http");
require("./websocket");
const port = env_1.default.app.port || 6060;
http_1.serverHttp.listen(port, () => console.log('Server is running'));
/*
<Say> — Read text to the caller
<Play> — Play an audio file for the caller
<Dial> — Add another party to the call
<Record> — Record the caller's voice
<Gather> — Collect digits the caller types on their keypad

<Hangup> — Hang up the call.
<Enqueue> — Add the caller to a queue of callers.
<Leave> — Remove a caller from a queue of callers.
<Pause> — Wait before executing more instructions.
<Redirect> — Redirect call flow to a different TwiML document.
<Refer> — Twilio initiates SIP REFER towards IP communication infrastructure.
<Reject> — Decline an incoming call without being billed.

<VirtualAgent> — Build AI-powered Conversational IVR.
*/ 
