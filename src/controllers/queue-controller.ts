import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import { listenerQueue } from "../core/http";
import { listUsersQueue } from "../helpers/queue";
import config from "../config/env";
import { Obj } from "../types";


// TO-DO: mudar pois nao usa a atual forma das filas
export const list = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const accountSid = config.twilio.accountSid;
    const authToken = config.twilio.authToken;

    const client = twilio(accountSid, authToken);

    const queues = await client.queues.list({ limit: 1000 });

    return response.status(201).send({ queues });
  }
  catch (error) {
    next(error);
  }
};

// TO-DO: mudar pois nao usa a atual forma das filas
export const listMembers = async (request: Request, response: Response, next: NextFunction) => {
  const m: Obj[] = [];
  try {
    const accountSid = config.twilio.accountSid;
    const authToken = config.twilio.authToken;

    const client = twilio(accountSid, authToken);

    const queues = await client.queues.list({ limit: 1000 });

    queues.forEach(async (q: Obj) => {
      const queue = q.dateUpdated;

      const members = await client.queues(queue.sid).members.list({ limit: 1000 });
      
      if (members) {
        m.push(members);
      }
    });

    return response.status(201).send({ members: m });
  }
  catch (error) {
    next(error);
  }
};

export const listClientMembers = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { company } = request.query;

    if (!company) {
      return response.status(400).send({ message: "Missing required filds" });
    }
    
    const value = listenerQueue.listCalls(String(company));

    if (!value) {
      const calls = JSON.parse(value);

      return response.status(201).send({ members: calls });
    } else {
      return response.status(201).send({ message: [] });
    }
  }
  catch (error) {
    next(error);
  }
};

export const handleRequeueCall = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { CallSid, company } = request.body;

    if (!company) {
      return response.status(400).send({ message: "Missing required filds" });
    }
    
    await listenerQueue.setRequeueCall(CallSid, company);

    return response.status(201).send({ message: "Call requeued" });
  }
  catch (error) {
    next(error);
  }
};

export const handleFinishCall = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { CallSid, company } = request.body;

    if (!company) {
      return response.status(400).send({ message: "Missing required fields" });
    }
    
    await listenerQueue.setFinishCall(CallSid, company);

    return response.status(201).send({ message: "Finish Call" });
  }
  catch (error) {
    next(error);
  }
};

export const handleOnCall = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { company } = request.body;

    if (!company) {
      return response.status(400).send({ message: "Missing required filds" });
    }
    
    const value = listenerQueue.listCalls(company);

    if (!value) {
      const calls = JSON.parse(value);

      return response.status(201).send({ members: calls });
    } else {
      return response.status(201).send({ message: [] });
    }
  }
  catch (error) {
    next(error);
  }
};

export const getQueueData = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { company, queueId } = request.query;

    if (!company){
      return response.status(400).send({ message: "Missing required fields" });
    }
    if (!queueId) {
      return response.status(400).send({ message: "Missing required fields" });
    }
    const queues = await listUsersQueue(String(company), String(queueId));
    
    let totalSize = 0
    if (queues){
      if (queues.length > 0){
        for (const queue of queues) {
          totalSize = totalSize + queue.members.length
        }
        const lastQueue = queues.map((queue) => { return Number(queue.queue.replace(company + ':' + queueId + ':', '')) }).sort().pop()
        const size = queues.find((queue) => { return queue.queue == company + ':' + queueId + ':' + lastQueue }).length
        return response.status(200).send({ queueId: company + ':' + queueId + ':' + lastQueue, size, totalSize });
      }
    }
    else {
      return response.status(200).send({ queueId: company + ':' + queueId + ':1', size: 0, totalSize: 0 });
    }
  }
  catch (error) {
    next(error);
  }
};