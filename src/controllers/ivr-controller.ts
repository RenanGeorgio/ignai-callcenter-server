import { NextFunction, Request, Response } from "express";
import { menu, planets, welcome } from "../lib/ivr";

export const goToMenu = (request: Request, response: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    console.log(request.body);
    const { Digits } = request.body

    return response.send(menu(Digits));
  }
  catch (error) {
    next(error);
  }
};

export const goToWelcome = (request: Request, response: Response, next: NextFunction) => {
  const companyId = "1";
  try {
    // @ts-ignore
    console.log(request.body);
    const {
      CallSid,
      Caller, 
      From, 
      To,
      CallStatus, 
      Direction,
      ForwardedFrom, 
      ParentCallSid, 
      CallToken
    } = request.body;
    
    response.send(welcome(companyId));
  }
  catch (error) {
    next(error);
  }
};

export const goToPlanets = (request: Request, response: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    console.log(request.body);
    const { Digits } = request.body

    response.send(planets(Digits));
  }
  catch (error) {
    next(error);
  }
};