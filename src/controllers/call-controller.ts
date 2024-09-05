import { Request, Response } from "express";
import VoiceResponse from "twilio";
import { isAValidPhoneNumber } from "../helpers/valid-phone-number";
import config from "../config/env";

export const handleOutgoingCall = (request: Request, response: Response) => {
  const { To } = request.body;

  const callerId = config.twilio.callerId;

  const client = new VoiceResponse.twiml.VoiceResponse();
  const dial = client.dial({ callerId: callerId });

  //dial.number(To);
  const attr = isAValidPhoneNumber(To) ? 'number' : 'client';
  dial[attr]({}, To);

  response.set('Content-Type', 'text/xml');
  response.send(client.toString());
};

export const handleIncomingCall = (request: Request, response: Response) => {
  const client = new VoiceResponse.twiml.VoiceResponse();
  const dial = client.dial({ callerId: request.body.From, answerOnBridge: true });

  dial.client('phil'); // puxar a identity

  response.set('Content-Type', 'text/xml');
  response.send(client.toString());
};