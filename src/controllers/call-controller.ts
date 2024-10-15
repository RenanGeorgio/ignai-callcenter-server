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
        console.log('welcome');
        const companyId = "1";
        response.send(welcome(companyId));
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

export const handleDirectIncomingCall = (request: Request, response: Response, next: NextFunction) => {
  // @ts-ignore
  console.log('incoming');
  try {
    // @ts-ignore
    console.log(request.body);
    const client = new twilio.twiml.VoiceResponse();
    const dial = client.dial({ callerId: request.body.From, answerOnBridge: true });

    const callerId = config.twilio?.callerId;
    //dial.client(callerId); // puxar a identity
    dial.client('Samuel');
    // @ts-ignore
    console.log('incoming 2');

    response.set('Content-Type', 'text/xml');
    response.send(client.toString());
  }
  catch (error) {
    next(error);
  }
};

export const handleIncomingCall = (request: Request, response: Response, next: NextFunction) => {
  const { Caller, From, To } = request.body;

  const caller = From ? From : Caller;

  let dial: any = undefined;
  try {
    const client = new twilio.twiml.VoiceResponse();

    if (isAValidPhoneNumber(caller)) {
      dial = client.dial({ callerId: caller, answerOnBridge: true });
    } else {
      dial = client.dial({ answerOnBridge: true });
    }

    // TO-DO: Usar o To (ou outro parametro confiavel) para descobrir a empresa
    dial.queue({
      url: '/about-to-connect',
      method: 'POST'
    }, 'support');

    // @ts-ignore
    console.log('respondendo')
    response.set('Content-Type', 'text/xml');
    response.send(client.toString());
  }
  catch (error) {
    next(error);
  }
};

export const handleIncomingQueuedCall = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { queue } = request.params;

    const { Caller, From, To } = request.body;
    const caller = From ? From : Caller;

    const client = new twilio.twiml.VoiceResponse();

    client.enqueue(
      {
        action: '/dequeue-action',
        method: 'POST',
        waitUrl: `/wait-room?queue=${queue}`,
        waitUrlMethod: 'POST',
  
      }, 
      queue // TO-DO: Pegar o nome correto
    );

    response.set('Content-Type', 'text/xml');
    response.send(client.toString());
  }
  catch (error) {
    next(error);
  }
};

export const handleDequeueCall = (request: Request, response: Response, next: NextFunction) => {
  const { From } = request.body;

  if (!From) {
    return response.status(400).send({ message: "Missing caller" });
  }

  try {
    const { queue } = request.params;

    const client = new twilio.twiml.VoiceResponse();
    const dial = client.dial({ callerId: From, answerOnBridge: true });

    dial.queue({
      url: '/about-to-connect',
      method: 'POST'
    }, queue);

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