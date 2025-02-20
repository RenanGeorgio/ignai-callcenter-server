import { NextFunction, Request, Response } from "express";
import { menu, planets, welcome } from "../lib/ivr";

export const goToMenu = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { Digits } = request.body

    return response.send(menu(Digits));
  }
  catch (error) {
    next(error);
  }
};

export const goToWelcome = (request: Request, response: Response, next: NextFunction) => {
  try {
    response.send(welcome());
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