import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import config from "../config/env";

export const getToken = (request: Request, response: Response, next: NextFunction) => {
  try {
    const accountSid = config.twilio.accountSid;
    const apiKey = config.twilio.apiKey;
    const apiSecret = config.twilio.apiSecret;
    const appSid = config.twilio.outgoingApplicationSid;

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const identity = request.body.identity ?? config.twilio?.callerId;

    if (!accountSid || !apiKey || !apiSecret) {
      throw new Error("accountSid, apiKey or apiSecret not present.")
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
    response.send(JSON.stringify(
      {
        identity: identity,
        token: accessToken.toJwt()
      }
    ));
  }
  catch (error) {
    next(error);
  }
};