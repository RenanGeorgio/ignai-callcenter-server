import { NextFunction, Request, Response } from "express";
import aboutToConnect from "../../lib/documents/about_to_connect";
import waitMusic from "../../lib/documents/wait-music";

export const toConnect = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { CallStatus, ForwardedFrom, ParentCallSid, Caller, From, To, QueueSid, CallSid, QueueTime, DequeingCallSid } = request.body;

    return response.send(aboutToConnect());
  }
  catch (error) {
    next(error);
  }
};

export const toWaitMusic = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { CallStatus, ForwardedFrom, ParentCallSid, Caller, From, To } = request.body;

    return response.send(waitMusic());
  }
  catch (error) {
    next(error);
  }
};