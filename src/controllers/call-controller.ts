import { Request, Response } from "express";
import twilio from "twilio";
import { isAValidPhoneNumber } from "../helpers/valid-phone-number";
import config from "../config/env";

export const handleOutgoingCall = (request: Request, response: Response) => {
  const { To } = request.body;

  const callerId = config.twilio.callerId;

  const client = new twilio.twiml.VoiceResponse();
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
  const attr = isAValidPhoneNumber(To) ? 'number' : 'client';
  dial[attr]({}, To);

  response.set('Content-Type', 'text/xml');
  response.send(client.toString());
};

export const handleIncomingCall = (request: Request, response: Response) => {
  const client = new twilio.twiml.VoiceResponse();
  const dial = client.dial({ callerId: request.body.From, answerOnBridge: true });

  dial.client('phil'); // puxar a identity

  response.set('Content-Type', 'text/xml');
  response.send(client.toString());
};

export const makeCall = (request: Request, response: Response) => {
  const client = twilio(config.twilio.accountSid, config.twilio.apiSecret);
  
  const { To, From } = request.body;

  async function createCall(To: string, From: string) {
    const call = await client.calls.create({
      from: From,
      to: To,
      twiml: "<Response><Say>Ahoy, World!</Say></Response>",
    });
  
    // @ts-ignore
    console.log(call.sid);
  }
  
  createCall(To, From);
  
  response.status(202);
};

export const handleFinishCall = (request: Request, response: Response) => {
  const client = new twilio.twiml.VoiceResponse();
 
  client.say(
    "Thank you for using Call Congress! " +
    "Your voice makes a difference. Goodbye."
  );

  client.hangup();

  response.set('Content-Type', 'text/xml');
  response.send(response.toString());
};