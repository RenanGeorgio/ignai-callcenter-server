import { NextFunction, Request, Response } from "express";
import { menu, routerFlow, welcome, taskFlow, agents } from "../lib/ivr";
import Welcome from "../models/welcome";
import Menu from "../models/menu";
import Agent from "../models/agent";

export const goToMenu = async (request: Request, response: Response, next: NextFunction) => {
  const { Digits } = request.body;
  try {
    const { user } = request.query;

    const menuData = await Menu.findOne({
      $elemMatch: { company: user }
    });

    const { menuList } = menuData;

    return response.send(menu(Digits, menuList, user));
  }
  catch (error) {
    next(error);
  }
};

export const goToWelcome = async (request: Request, response: Response, next: NextFunction) => {
  const body = request.body;
  try {
    const { From, To, CallSid } = body;

    const welcomeData = await Welcome.findOne({
      phoneInfo: { 
        $elemMatch: { phoneNumber: To } 
      }
    });

    const { company, menu, values } = welcomeData;

    response.send(welcome(company, menu, values));
  }
  catch (error) {
    next(error);
  }
};

export const goToRouterFlow = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { Digits } = request.body

    response.send(routerFlow(Digits));
  }
  catch (error) {
    next(error);
  }
};

export const goToTaskFlow = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { Digits } = request.body

    response.send(taskFlow(Digits));
  }
  catch (error) {
    next(error);
  }
};

export const goToAgents = async (request: Request, response: Response, next: NextFunction) => {
  const { Digits } = request.body;
  try {
    const { user } = request.query;

    const welcomeData = await Welcome.findOne({
      $elemMatch: { company: user }
    });

    const { phoneInfo } = welcomeData;

    response.send(agents(Digits, phoneInfo));
  }
  catch (error) {
    next(error);
  }
};