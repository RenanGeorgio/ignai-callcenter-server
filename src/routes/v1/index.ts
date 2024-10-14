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

// User
import * as UserController from "../../controllers/user-controller";
import identifyFrom from "../../middlewares/identifyFrom";

routes
    // call
    .post('/token', TokenController.getToken)
    .post('/outgoing', identifyFrom, CallController.handleOutgoingCall)
    .post('/incoming', twilio.webhook({ validate: false }), identifyFrom,  CallController.handleIncomingCall)
    .post('/goodbye', identifyFrom, CallController.handleFinishCall)
    .post('/call', twilio.webhook({ validate: false }), identifyFrom, CallController.handleCall)

    // ivr
    .post('/welcome', twilio.webhook({ validate: false }), IvrController.goToWelcome)
    .post('/menu', twilio.webhook({ validate: false }), IvrController.goToMenu)
    .post('/planets', twilio.webhook({ validate: false }), IvrController.goToPlanets)

    // Test Server
    .get('/server', Server.status)

    // User
    .get('/user/:id', UserController.find)
    .post('/user', UserController.create)
    .put('/user/:id', UserController.update)
    .delete('/user/:id', UserController.del)

export default routes;

/*
- validate: {Boolean} whether or not the middleware should validate the request
    came from Twilio.  Default true. If the request does not originate from
    Twilio, we will return a text body and a 403.  If there is no configured
    auth token and validate=true, this is an error condition, so we will return
    a 500.
    */