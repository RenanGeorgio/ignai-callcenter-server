import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import { welcome } from "../lib/ivr";
import { isAValidPhoneNumber } from "../helpers/valid-phone-number";
import config from "../config/env";


export const handleCall = (request: Request, response: Response, next: NextFunction) => {
  const hasIvr = true; // TO-DO: checkar se o usuario possui IVR (URA)
  const body = request.body;

  let dial: any = undefined;
  // @ts-ignore
  console.log(body);
  try {
    const { Called, Caller, From, To, Direction } = body;
    
    const callerId = config.twilio?.callerId;
    const client = new twilio.twiml.VoiceResponse();
    // @ts-ignore
    console.log(callerId);

    let new_oringin: string = "";

    const oringin = From | Caller
    if ((!isNaN(oringin)) || (typeof oringin === 'number')) {
      new_oringin = oringin.toString();
    } else {
      new_oringin = oringin;
    }

    if ((Direction.toLowerCase() === 'inbound') && (To.length === 0) && (new_oringin.length > 0)) {
      if (hasIvr) {
        // @ts-ignore
        console.log('welcome')
        response.send(welcome());
      } else {
        if (isAValidPhoneNumber(new_oringin)) {
          // @ts-ignore
          console.log(new_oringin)
          dial = client.dial({ callerId: new_oringin, answerOnBridge: true });
        } else {
          // @ts-ignore
          console.log('teste')
          dial = client.dial({ answerOnBridge: true });
        }

        // @ts-ignore
        console.log(callerId)
        dial.client(callerId); // puxar a identity

        // @ts-ignore
        console.log('respondendo')
        response.set('Content-Type', 'text/xml');
        response.send(client.toString());
      }
    } else {
      dial = client.dial({ callerId: callerId });
      // @ts-ignore
      console.log(dial);

      if ((To != undefined) && (To != callerId) && (To.length > 0)) {
        // @ts-ignore
        console.log(To)
        const attr = isAValidPhoneNumber(To) ? 'number' : 'client';
        dial[attr]({}, To);
      } else {
        // @ts-ignore
        console.log('support')
        dial.client({}, 'support_agent'); // TO-DO: ref -> browser call
      }

      // @ts-ignore
      console.log('respondendo')
      response.set('Content-Type', 'text/xml');
      response.send(client.toString());
    }

    response.status(202);
  }
  catch (error) {
    next(error);
  }
};

export const handleOutgoingCall = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { To } = request.body;

    const callerId = config.twilio?.callerId;

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
  }
  catch (error) {
    next(error);
  }
};

export const handleIncomingCall = (request: Request, response: Response, next: NextFunction) => {
  try {
    const client = new twilio.twiml.VoiceResponse();
    const dial = client.dial({ callerId: request.body.From, answerOnBridge: true });

    const callerId = config.twilio?.callerId;
    dial.client(callerId); // puxar a identity

    response.set('Content-Type', 'text/xml');
    response.send(client.toString());
  }
  catch (error) {
    next(error);
  }
};

export const makeCall = (request: Request, response: Response, next: NextFunction) => {
  try {
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
  }
  catch (error) {
    next(error);
  }
};

export const handleFinishCall = (request: Request, response: Response, next: NextFunction) => {
  try {
    const client = new twilio.twiml.VoiceResponse();

    client.say(
      "Thank you for using Call Congress! " +
      "Your voice makes a difference. Goodbye."
    );

    client.hangup();

    response.set('Content-Type', 'text/xml');
    response.send(response.toString());
  }
  catch (error) {
    next(error);
  }
};