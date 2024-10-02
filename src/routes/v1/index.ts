import { Router } from "express";
import twilio from "twilio";

const routes = Router();

// Token
import * as TokenController from "../../controllers/token-controller";

// Call
import * as CallController from "../../controllers/call-controller";
import * as IvrController from "../../controllers/ivr-controller";

// Server
import Server from "../../controllers/server";

routes
    // call
    .post('/token', TokenController.getToken)
    .post('/call', CallController.handleOutgoingCall)
    .post('/incoming', CallController.handleIncomingCall)
    .post('/goodbye', CallController.handleFinishCall)

    // ivr
    .post('/welcome', twilio.webhook({ validate: false }), IvrController.goToWelcome)
    .post('/menu', twilio.webhook({ validate: false }), IvrController.goToMenu)
    .post('/planets', twilio.webhook({ validate: false }), IvrController.goToPlanets)

    // Test Server
    .get('/server', Server.status)

export default routes;

/*
- validate: {Boolean} whether or not the middleware should validate the request
    came from Twilio.  Default true. If the request does not originate from
    Twilio, we will return a text body and a 403.  If there is no configured
    auth token and validate=true, this is an error condition, so we will return
    a 500.
    */