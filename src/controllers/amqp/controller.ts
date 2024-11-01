import { NextFunction, Request, Response } from "express";
import { amqpService, listenerQueue } from "../../core/http";
import { QueueAgentDTO } from "../../core/amqp/types";
import { listUsersQueue } from "../../helpers/queue";

export const handleMsg = (request: Request, response: Response, next: NextFunction) => {
  try {
    const data: QueueAgentDTO = request.body;

    amqpService.sendData(data);

    // @ts-ignore
    console.log("A message is sent to queue");
    response.send("Message Sent");
  }
  catch (error) {
    next(error);
  }
}

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

    const queues = await listUsersQueue(company, queueId);

    const queue_ = queues[-1];
    const { queue, members } = queue_;
    
    return response.status(201).send({ queue: queue, size: String(members.length) });
  }
  catch (error) {
    next(error);
  }
}