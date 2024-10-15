import { NextFunction, Request, Response } from "express";
import { sendEventToClients, NotifyAgentDTO } from "../../lib/events/notify-agent";
import aboutToConnect from "../../lib/documents/about_to_connect";
import waitMusic from "../../lib/documents/wait-music";

export const toConnect = (request: Request, response: Response, next: NextFunction) => {
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

    return response.send(aboutToConnect());
  }
  catch (error) {
    next(error);
  }
};

export const toWaitRoom = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { queue, company } = request.params;

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

    sendEventToClients(notifydata);

    return response.send(waitMusic());
  }
  catch (error) {
    next(error);
  }
};

export const toActionTake = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { 
      Caller, 
      From, 
      To,
      QueueResult,
      QueueSid,
      QueueTime
    } = request.body;

    return response.send(waitMusic());
  }
  catch (error) {
    next(error);
  }
};