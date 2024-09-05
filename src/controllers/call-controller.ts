import { Request, Response } from "express";
import VoiceResponse from "twilio";
import config from "../config/env";

export const handleOutgoingCall = (request: Request, response: Response) => {
  const { To } = request.body;

  const client = new VoiceResponse.twiml.VoiceResponse();
  const dial = client.dial({ callerId: config.twilio.callerId });

  dial.number(To);

  response.set('Content-Type', 'text/xml');
  response.send(client.toString());
};

export const handleIncomingCall = (request: Request, response: Response) => {
  const client = new VoiceResponse.twiml.VoiceResponse();
  const dial = client.dial({ callerId: request.body.From, answerOnBridge: true });

  dial.client('phil');

  response.set('Content-Type', 'text/xml');
  response.send(client.toString());
};