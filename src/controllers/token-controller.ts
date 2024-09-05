import { Request, Response } from "express";
import twilio from "twilio";
import config from "../config/env";

export const getToken = (request: Request, response: Response) => {
  const accountSid = config.twilio.accountSid;
  const apiKey = config.twilio.apiKey;
  const apiSecret = config.twilio.apiSecret;
  const appSid = config.twilio.outgoingApplicationSid;

  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const identity = request.body.identity ?? config.twilio?.agentId;

  const accessToken = new AccessToken(accountSid, apiKey, apiSecret, {
    identity,
  });

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: appSid,
    incomingAllow: true,
  });

  accessToken.addGrant(voiceGrant);

  response.set('Content-Type', 'application/json');
  response.send(JSON.stringify({ token: accessToken.toJwt() }));
};