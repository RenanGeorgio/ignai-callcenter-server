import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import config from "../config/env";
import { Obj } from "../types";

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
  const calls: Obj[] = [];

  const accountSid = config.twilio.accountSid;
  const authToken = config.twilio.authToken;

  try {
    const { company } = request.query;

    const client = twilio(accountSid, authToken);

    // TO-DO: pegar queue ativas para esta empresa
    const members = await client.queues(queue.sid).members.list({ limit: 1000 });

    const queuedCalls = members.queue_members;

    queuedCalls.forEach(async (queuedCall: Obj) => {
      const callSid = queuedCall['call_sid'];

      const call = await client.calls(callSid).fetch();
      
      if (call) {
        const info = {
          company: company,
          queue: queuedCall.friendly_name,
          data: {
            CallSid: callSid,
            Caller: call['caller_name'], 
            From: call['from'], 
            To: call['to'],
            QueuePosition: queuedCall['position'], 
            QueueSid: queuedCall['queue_sid'], 
            QueueTime: call['queue_time'], 
            CurrentQueueSize: queuedCalls.length
          }
        }

        calls.push(info);
      }
    });

    return response.status(201).send({ members: calls });
  }
  catch (error) {
    next(error);
  }
};