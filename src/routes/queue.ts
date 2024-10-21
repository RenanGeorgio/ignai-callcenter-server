import { Router } from "express";

const queueRoutes = Router();

// Token
import * as Controller from "../controllers/amqp/controller";

queueRoutes
  // queue
  .post('/send-msg', Controller.handleMsg)
  .post('/on-call', Controller.handleOnCall)

export default queueRoutes;