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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFinishCall = exports.makeCall = exports.handleIncomingCall = exports.handleOutgoingCall = void 0;
const twilio_1 = __importDefault(require("twilio"));
const valid_phone_number_1 = require("../helpers/valid-phone-number");
const env_1 = __importDefault(require("../config/env"));
const handleOutgoingCall = (request, response, next) => {
    try {
        const { To } = request.body;
        const callerId = env_1.default.twilio.callerId;
        const client = new twilio_1.default.twiml.VoiceResponse();
        const dial = client.dial({ callerId: callerId });
        //dial.number(To);
        /*
        if (To) {
          const attr = isAValidPhoneNumber(To) ? 'number' : 'client';
          dial[attr]({}, To);
        } else {
          dial.client({}, "support_agent"); // TO-DO: ref -> browser call
        }
          */
        const attr = (0, valid_phone_number_1.isAValidPhoneNumber)(To) ? 'number' : 'client';
        dial[attr]({}, To);
        response.set('Content-Type', 'text/xml');
        response.send(client.toString());
    }
    catch (error) {
        next(error);
    }
};
exports.handleOutgoingCall = handleOutgoingCall;
const handleIncomingCall = (request, response, next) => {
    try {
        const client = new twilio_1.default.twiml.VoiceResponse();
        const dial = client.dial({ callerId: request.body.From, answerOnBridge: true });
        dial.client('phil'); // puxar a identity
        response.set('Content-Type', 'text/xml');
        response.send(client.toString());
    }
    catch (error) {
        next(error);
    }
};
exports.handleIncomingCall = handleIncomingCall;
const makeCall = (request, response, next) => {
    try {
        const client = (0, twilio_1.default)(env_1.default.twilio.accountSid, env_1.default.twilio.apiSecret);
        const { To, From } = request.body;
        function createCall(To, From) {
            return __awaiter(this, void 0, void 0, function* () {
                const call = yield client.calls.create({
                    from: From,
                    to: To,
                    twiml: "<Response><Say>Ahoy, World!</Say></Response>",
                });
                // @ts-ignore
                console.log(call.sid);
            });
        }
        createCall(To, From);
        response.status(202);
    }
    catch (error) {
        next(error);
    }
};
exports.makeCall = makeCall;
const handleFinishCall = (request, response, next) => {
    try {
        const client = new twilio_1.default.twiml.VoiceResponse();
        client.say("Thank you for using Call Congress! " +
            "Your voice makes a difference. Goodbye.");
        client.hangup();
        response.set('Content-Type', 'text/xml');
        response.send(response.toString());
    }
    catch (error) {
        next(error);
    }
};
exports.handleFinishCall = handleFinishCall;
