import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import { setCompanyAgents } from "../lib/online-agents";
import { Agent } from "../models";
import config from "../config/env";
import { Obj } from "../types";

export const getToken = async (request: Request, response: Response, next: NextFunction) => {
  const accountSid = config.twilio.accountSid;
  const apiKey = config.twilio.apiKey;
  const apiSecret = config.twilio.apiSecret;
  const appSid = config.twilio.outgoingApplicationSid;

  if (!accountSid || !apiKey || !apiSecret) {
    throw new Error("accountSid, apiKey or apiSecret not present.");
  }

  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  try {
    const identity = request.body.identity ?? config.twilio?.callerId;

    if (!identity) {
      response.status(400).send({ message: "Identity is missing!" });
    }

    const accessToken = new AccessToken(accountSid, apiKey, apiSecret, {
      identity,
    });

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: appSid,
      incomingAllow: true,
    });

    accessToken.addGrant(voiceGrant);

    const agentData = await Agent.findOne({
      agentName: identity
    });

    if (agentData) {
      const allowedQueues: string[] = agentData.allowedQueues.map((allowedQueue: Obj) => allowedQueue.queue || "");
      setCompanyAgents(agentData.company, allowedQueues, agentData.agentName);
    }
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