import { NextFunction, Request, Response } from "express";
import { amqpService, listenerQueue } from "../../core/http";

export const handleMsg = (request: Request, response: Response, next: NextFunction) => {
  try {
    const data = {
      title: "Six of Crows",
      author: "Leigh Burdugo"
    }

    amqpService.sendData(data);

    // @ts-ignore
    console.log("A message is sent to queue");
    response.send("Message Sent");
  }
  catch (error) {
    next(error);
  }
};

export const handleOnCall = (request: Request, response: Response, next: NextFunction) => {
  try {
    const data = {
      title: "Six of Crows",
      author: "Leigh Burdugo"
    }

    listenerQueue.findMessage(data.CallSid);

    // @ts-ignore
    console.log("A message is sent to queue");
    response.send("Message Sent");
  }
  catch (error) {
    next(error);
  }
};