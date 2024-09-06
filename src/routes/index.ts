import { Router } from "express";
import twilio from "twilio";

import { routes as ivrRoutes } from "./v1/ivr";
import routes from "./v1/app";

const router = Router();

router.use('/ivr', twilio.webhook({ validate: false }), ivrRoutes);

export {
  router as ivrRoutes,
  routes as appRoutes
};