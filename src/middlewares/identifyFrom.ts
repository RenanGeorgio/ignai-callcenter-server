import Twilio from "../models/twilio";
import { NextFunction, Request, Response } from "express"

async function identifyFrom(req: Request, res: Response, next: NextFunction) {
  try {
    const { From } = req?.body
    if (From){
      const twilioConfig = await Twilio.findOne({ callerId: From })
      if (twilioConfig){
        req.body = { ...req?.body, twilioConfig }
        next();
      } else {
        throw new Error("Twilio config doesn't found for this number! " + From)
      }
    } else {
      next();
    }
  } catch (error) {
    console.error(error)
    next(error);
  }
}

export default identifyFrom;