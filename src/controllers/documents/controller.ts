import { NextFunction, Request, Response } from "express";
import { sendEventToClients, NotifyAgentDTO } from "../../lib/events/notify-agent";
import aboutToConnect from "../../lib/documents/about_to_connect";
import waitMusic from "../../lib/documents/wait-music";

export const toConnect = (request: Request, response: Response, next: NextFunction) => {
  // @ts-ignore
  console.log("to connect");
  const { queue } = request.query;
  try {
    const { 
      CallStatus, 
      ForwardedFrom, 
      ParentCallSid, 
      Caller, 
      From, 
      To, 
      QueueSid, 
      CallSid, 
      QueueTime, 
      DequeingCallSid 
    } = request.body;

    const value = { 
      CallStatus, 
      ForwardedFrom, 
      ParentCallSid, 
      Caller, 
      From, 
      To, 
      QueueSid, 
      CallSid, 
      QueueTime, 
      DequeingCallSid 
    }

    // @ts-ignore
    console.log(value);

    return response.send(aboutToConnect());
  }
  catch (error) {
    next(error);
  }
};

export const toWaitRoom = (request: Request, response: Response, next: NextFunction) => {
  // @ts-ignore
  console.log("to wait room");
  try {
    const { queue, company } = request.query;
    // @ts-ignore
    console.log(request.query);

    // @ts-ignore
    console.log(request.params);

    const { 
      Caller, 
      From, 
      To,
      QueuePosition, 
      QueueSid, 
      QueueTime, 
      AvgQueueTime, 
      CurrentQueueSize, 
      MaxQueueSize 
    } = request.body;

    const eventdata = {
      Caller, 
      From, 
      To,
      QueuePosition, 
      QueueSid, 
      QueueTime, 
      AvgQueueTime, 
      CurrentQueueSize, 
      MaxQueueSize 
    }

    const notifydata: NotifyAgentDTO = {
      eventData: eventdata,
      filterCompanyId: company,
      filterQueueId: queue ? queue : undefined
    }

    // @ts-ignore
    console.log('notify data: ', notifydata);

    sendEventToClients(notifydata);

    return response.send(waitMusic());
  }
  catch (error) {
    next(error);
  }
};

export const toActionTake = (request: Request, response: Response, next: NextFunction) => {
  // @ts-ignore
  console.log("toActionTake");
  try {
    const { 
      Caller, 
      From, 
      To,
      QueueResult,
      QueueSid,
      QueueTime
    } = request.body;

    const value = { 
      Caller, 
      From, 
      To,
      QueueResult,
      QueueSid,
      QueueTime
    }

    // @ts-ignore
    console.log(value);

    return response.send(waitMusic());
  }
  catch (error) {
    next(error);
  }
};