"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    app: {
        port: process.env.PORT || 6060,
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        apiKey: process.env.TWILIO_API_KEY,
        apiSecret: process.env.TWILIO_API_SECRET,
        outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
        incomingAllow: process.env.TWILIO_ALLOW_INCOMING_CALLS === 'true',
        callerId: process.env.FROM_NUMBER,
        agentId: process.env.AGENT_ID
    }
};
exports.default = config;
