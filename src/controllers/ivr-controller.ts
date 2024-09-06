import { Request, Response } from "express";
import { menu, planets, welcome } from "../lib/ivr";

export const goToMenu = (request: Request, response: Response) => {
  const { Digits } = request.body
  
  return response.send(menu(Digits));
};

export const goToWelcome = (request: Request, response: Response) => {
  response.send(welcome());
};

export const goToPlanets = (request: Request, response: Response) => {
  const { Digits } = request.body
  
  response.send(planets(Digits));
};