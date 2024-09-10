"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voiceToken = exports.chatToken = void 0;
const twilio_1 = __importDefault(require("twilio"));
const AccessToken = twilio_1.default.jwt.AccessToken;
const { ChatGrant, VoiceGrant } = AccessToken;
// @ts-ignore
const generateToken = (config, identity) => {
    return new AccessToken(config.twilio.accountSid, config.twilio.apiKey, config.twilio.apiSecret, {
        identity,
    });
};
// @ts-ignore
const chatToken = (identity, config) => {
    const chatGrant = new ChatGrant({
        serviceSid: config.twilio.chatService
    });
    const token = generateToken(config, identity);
    token.addGrant(chatGrant);
    //token.identity = identity;
    return token;
};
exports.chatToken = chatToken;
// @ts-ignore
const voiceToken = (identity, config) => {
    let voiceGrant;
    if (typeof config.twilio.outgoingApplicationSid !== 'undefined') {
        voiceGrant = new VoiceGrant({
            outgoingApplicationSid: config.twilio.outgoingApplicationSid,
            incomingAllow: config.twilio.incomingAllow
        });
    }
    else {
        voiceGrant = new VoiceGrant({
            incomingAllow: config.twilio.incomingAllow
        });
    }
    const token = generateToken(config, identity);
    token.addGrant(voiceGrant);
    //token.identity = identity;
    return token;
};
exports.voiceToken = voiceToken;
