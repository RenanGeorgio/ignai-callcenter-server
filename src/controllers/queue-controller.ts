import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import { listenerQueue } from "../core/http";
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