"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const twilio_1 = __importDefault(require("twilio"));
const env_1 = __importDefault(require("../config/env"));
const getToken = (request, response, next) => {
    var _a, _b;
    try {
        const accountSid = env_1.default.twilio.accountSid;
        const apiKey = env_1.default.twilio.apiKey;
        const apiSecret = env_1.default.twilio.apiSecret;
        const appSid = env_1.default.twilio.outgoingApplicationSid;
        const AccessToken = twilio_1.default.jwt.AccessToken;
        const VoiceGrant = AccessToken.VoiceGrant;
        const identity = (_a = request.body.identity) !== null && _a !== void 0 ? _a : (_b = env_1.default.twilio) === null || _b === void 0 ? void 0 : _b.agentId;
        if (!accountSid || !apiKey || !apiSecret) {
            throw new Error("accountSid, apiKey or apiSecret not present.");
        }
        const accessToken = new AccessToken(accountSid, apiKey, apiSecret, {
            identity,
        });
        const voiceGrant = new VoiceGrant({
            outgoingApplicationSid: appSid,
            incomingAllow: true,
        });
        accessToken.addGrant(voiceGrant);
        /*
        const headers = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json"
        };
              
        response.setHeaders(headers);*/
        response.set('Content-Type', 'application/json');
        response.send(JSON.stringify({
            identity: identity,
            token: accessToken.toJwt()
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.getToken = getToken;
