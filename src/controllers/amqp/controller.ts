import { NextFunction, Request, Response } from "express";
import { amqpService } from "../../core/http";
import { QueueAgentDTO } from "../../core/amqp/types";


export const handleMsg = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const data: QueueAgentDTO = request.body;

    await amqpService.sendData(data);

    // @ts-ignore
    console.log("A message is sent to queue");
    response.send("Message Sent");
  }
  catch (error) {
    next(error);
  }
};