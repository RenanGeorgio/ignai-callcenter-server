import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
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
    // @ts-ignore
    console.log(Called)
    // @ts-ignore
    console.log(Caller)
    // @ts-ignore
    console.log(From)
    // @ts-ignore
    console.log(To)
    // @ts-ignore
    console.log(Direction)
    const callerId = config.twilio?.callerId;
    const client = new twilio.twiml.VoiceResponse();
    // @ts-ignore
    console.log(callerId)
    if ((To != undefined) && (To != callerId)) {
      dial = client.dial({ callerId: callerId });
      // @ts-ignore
      console.log(dial)
      /*
      if (To) {
        const attr = isAValidPhoneNumber(To) ? 'number' : 'client';
        dial[attr]({}, To);
      } else {
        dial.client({}, "support_agent"); // TO-DO: ref -> browser call
      }
        */
      const attr = isAValidPhoneNumber(To) ? 'number' : 'client';
      // @ts-ignore
      console.log(attr)
      dial[attr]({}, To);
    } else {
      if (hasIvr) {
        // @ts-ignore
        console.log('welcome')
        client.redirect('/welcome');

        return client.toString();
      } else {
        if (From) {
          // @ts-ignore
          console.log(From)
          dial = client.dial({ callerId: body.From, answerOnBridge: true });
        } else {
          // @ts-ignore
          console.log('regular')
          dial = client.dial({ answerOnBridge: true });
        }

        // @ts-ignore
        console.log(callerId)
        dial.client(callerId); // puxar a identity
      }
    }

    // @ts-ignore
    console.log('respondendo')
    response.set('Content-Type', 'text/xml');
    response.send(client.toString());
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

    dial.client('phil'); // puxar a identity

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