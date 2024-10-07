import { NextFunction, Request, Response } from "express";
import { menu, planets, welcome } from "../lib/ivr";
import Welcome from "../models/welcome";

export const goToMenu = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { Digits } = request.body

    return response.send(menu(Digits));
  }
  catch (error) {
    next(error);
  }
};

export const goToWelcome = async (request: Request, response: Response, next: NextFunction) => {
  const body = request.body;
  try {
    const { Called, Caller, From, To, CallSid } = body;

    const welcomeData = await Welcome.findOne({
      phoneInfo: { 
        $elemMatch: { phoneNumber: To } 
      }
    });

    const { company, menu, values } = welcomeData;

    response.send(welcome(From, To, CallSid, company, menu, values));
  }
  catch (error) {
    next(error);
  }
};

export const goToPlanets = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { Digits } = request.body

    response.send(planets(Digits));
  }
  catch (error) {
    next(error);
  }
};