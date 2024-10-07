import { NextFunction, Request, Response } from "express";
import { menu, planets, welcome } from "../lib/ivr";
import Welcome from "../models/welcome";
import Menu from "../models/menu";

export const goToMenu = async (request: Request, response: Response, next: NextFunction) => {
  const { Digits } = request.body;
  try {
    const { user } = request.query;

    const menuData = await Menu.findOne({
      $elemMatch: { company: user }
    });

    const { menuList } = menuData;

    return response.send(menu(Digits, menuList));
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