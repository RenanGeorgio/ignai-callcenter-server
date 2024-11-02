import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import { welcome } from "../lib/ivr";
import { waitMusic } from "../lib/documents";
import { addUserQueue, ClientInQ } from "../helpers/queue";
import { isAValidPhoneNumber } from "../helpers/valid-phone-number";
import config from "../config/env";
import { Company } from "../models";
import { Obj } from "../types";

// REFERENCIAS PARA OPERACOES 'AVANCADAS' DA TWILIO
// [1] - https://console.twilio.com/us1/develop/twimlets/create?twimlet=forward
// [2] - https://console.twilio.com/us1/develop/twimlets/create?twimlet=simulring
// [3] - https://console.twilio.com/us1/develop/twimlets/create?twimlet=findme

// Ponto inicial de entrada das ligacoes
export const handleCall = async (request: Request, response: Response, next: NextFunction) => { // nao sei se pode ser async
  const body = request.body;

  let dial: any = undefined;
  let company: Obj | undefined = undefined;
  let oringinCompany: Obj | undefined = undefined;
  let new_oringin: string = "";
  // @ts-ignore
  console.log(body);
  try {
    const {
      CallSid,
      Called,
      Caller, 
      From, 
      To,
      CallStatus, 
      Direction,
      ForwardedFrom, 
      ParentCallSid, 
      CallToken
    } = body;
    
    const callerId = config.twilio?.callerId;
    const client = new twilio.twiml.VoiceResponse();

    // @ts-ignore
    console.log(callerId);

    const oringin = From | Caller
    if ((!isNaN(oringin)) || (typeof oringin === 'number')) {
      new_oringin = oringin.toString();
    } else {
      new_oringin = oringin;
    }

    if (To) {
      if ((To.length > 0) && (isAValidPhoneNumber(To))) {
        const musicResponse = waitMusic();
        response.type('text/xml');
        response.send(musicResponse);

        company = await Company.findOne({ "phoneInfo.phoneNumber": To });

        if ((new_oringin.length > 0) && (isAValidPhoneNumber(new_oringin))) {
          oringinCompany = await Company.findOne({ "phoneInfo.phoneNumber": new_oringin });
        }
      }
    }

    if (
      ((To === callerId) && (callerId != undefined)) ||
      ((Direction.toLowerCase() === 'inbound') && (To.length === 0) && (new_oringin.length > 0)) ||
      ((company != undefined) && (oringinCompany == undefined))
    ) {
      if (company?.welcomeId) {
        // @ts-ignore
        console.log('welcome');
        response.send(welcome(company._id));
      } else {
        if (isAValidPhoneNumber(new_oringin)) {
          dial = client.dial({ callerId: new_oringin, answerOnBridge: true });
        } else {
          dial = client.dial({ answerOnBridge: true });
        }

        // @ts-ignore
        console.log(callerId)

        const identity = company?.identity;

        if (identity) {
          dial.client(identity);
        } else {
          dial.client(callerId);
        }

        // @ts-ignore
        console.log('respondendo')
        response.set('Content-Type', 'text/xml');
        response.send(client.toString());
      }
    } else if ((To) && (To.length > 0)) {
      if (isAValidPhoneNumber(new_oringin)) {
        dial = client.dial({ callerId: new_oringin });
      } else {
        dial = client.dial({ callerId: callerId });
      }
     
      const attr = isAValidPhoneNumber(To) ? 'number' : 'client';
      dial[attr]({
        url: '/about-to-pickup',
        method: 'POST',
        statusCallbackEvent: 'initiated ringing answered completed',
        statusCallback: '/call-callback',
        statusCallbackMethod: 'POST'
      }, To);

      // @ts-ignore
      console.log('respondendo')
      response.set('Content-Type', 'text/xml');
      response.send(client.toString());
    } else {
      try {
        dial = client.dial({ 
          action: '/finish-dial',
          method: 'POST',
          callerId: callerId
        });
        dial.client({}, 'support_agent'); // ref -> browser call

        // @ts-ignore
        console.log('respondendo')
        response.set('Content-Type', 'text/xml');
        response.send(client.toString());
      } catch (error: any) {
        console.error(error);

        client.say('Obrigado por ligar!');

        response.type('text/xml');
        response.send(client.toString());
      }
    }

    response.status(202);
  }
  catch (error) {
    next(error);
  }
};

// Tratamento para ligacoes realizadas (fora do ponto de entrada)
export const handleOutgoingCall = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { To } = request.body;

    const callerId = config.twilio?.callerId;

    const client = new twilio.twiml.VoiceResponse();
    const dial = client.dial({ callerId: callerId });

    const attr = isAValidPhoneNumber(To) ? 'number' : 'client';
    dial[attr]({
      url: '/about-to-pickup',
      method: 'POST',
      statusCallbackEvent: 'initiated ringing answered completed',
      statusCallback: '/call-callback',
      statusCallbackMethod: 'POST'
    }, To);

    response.set('Content-Type', 'text/xml');
    response.send(client.toString());
  }
  catch (error) {
    next(error);
  }
};

// Tratamento para mandar incoming direto para um agente (fora do ponto de entrada)
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

// Tratamento para mandar incoming em modo default (fora do ponto de entrada)
export const handleIncomingCall = (request: Request, response: Response, next: NextFunction) => {
  const client = new twilio.twiml.VoiceResponse();

  let dial: any = undefined;
  try {
    const { Caller, From, To } = request.body;

    const caller = From ? From : Caller;

    if (isAValidPhoneNumber(caller)) {
      dial = client.dial({ callerId: caller, answerOnBridge: true });
    } else {
      dial = client.dial({ answerOnBridge: true });
    }

    dial.queue({
      url: '/about-to-connect',
      method: 'POST'
    }, 'default');

    response.set('Content-Type', 'text/xml');
    response.send(client.toString());
  }
  catch (error) {
    next(error);
  }
};

// Coloca ligacao na fila de espera
export const handleIncomingQueuedCall = (request: Request, response: Response, next: NextFunction) => {
  // @ts-ignore
  console.log("handleIncomingQueuedCall");
  const { queue, company } = request.query;

  // @ts-ignore
  console.log(queue);

  try {
    // @ts-ignore
    console.log(request.body);

    async function pushToQueue(companyId: string, queueId: string) {
      const client = new twilio.twiml.VoiceResponse();

      const user: ClientInQ = await addUserQueue(companyId, queueId);

      client.enqueue(
        {
          action: `/dequeue-action?company=${companyId}`,
          method: 'POST',
          waitUrl: `/wait-room?queue=${user.queue}&company=${companyId}&client=${user.user}`,
          waitUrlMethod: 'POST',
        }, 
        user.queue
      );

      response.set('Content-Type', 'text/xml');
      response.send(client.toString());
    }

    pushToQueue(company, queue);
  }
  catch (error) {
    next(error);
  }
};

// Puxa ligacao da fila de espera
export const handleDequeueCall = async (request: Request, response: Response, next: NextFunction) => {
  // @ts-ignore
  console.log("handleDequeueCall");
  const { queueId } = request.query;
  // @ts-ignore
  console.log(queueId);

  if (!queueId) {
    return response.status(400).send({ message: "Missing queue identifier" }); 
  }

  try {
    const { 
      agentName,
      company,
      From,
      To,
      Caller,
      position
    } = request.body;

    if (!From) {
      return response.status(400).send({ message: "Missing caller" }); 
    }
    
    const client = new twilio.twiml.VoiceResponse();
    const dial = client.dial({ callerId: From, answerOnBridge: true });

    // @ts-ignore
    console.log(From);

    const user: ClientInQ = await addUserQueue(company, queueId);

    dial.queue({
      url: `/about-to-connect?queue=${user.queue}&companyId=${company}`,
      method: 'POST'
    }, user.queue);

    // @ts-ignore
    console.log("handleDequeueCall 2");

    response.set('Content-Type', 'text/xml');
    response.send(client.toString());
  }
  catch (error) {
    next(error);
  }
};

// Fazer ligacao via API
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

// Mensagem de finalizacao
export const handleFinishCall = (request: Request, response: Response, next: NextFunction) => {
  try {
    const client = new twilio.twiml.VoiceResponse();

    client.say("Muito obrigado por ligar!");

    client.hangup();

    response.set('Content-Type', 'text/xml');
    response.send(response.toString());
  }
  catch (error) {
    next(error);
  }
};

/*
Status callbacks do not control call flow, so TwiML does not need to be returned. 
If you do respond, use status code 204 No Content or 200 OK with 
Content-Type: text/xml and an empty <Response/> in the body. 
Not responding properly will result in warnings in Debugger.
*/