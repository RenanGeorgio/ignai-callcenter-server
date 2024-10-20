import { NextFunction, Request, Response } from "express";
import { sendData } from "../../lib/mq-messages";

export const handleMsg = (request: Request, response: Response, next: NextFunction) => {
  try {
    const data = {
      title: "Six of Crows",
      author: "Leigh Burdugo"
    }

    sendData(data);

    // @ts-ignore
    console.log("A message is sent to queue");
    response.send("Message Sent");
  }
  catch (error) {
    next(error);
  }
};