import { Router } from "express";
import twilio from "twilio";

const routes = Router();

// Token
import * as TokenController from "../../controllers/token-controller";

// Call
import * as CallController from "../../controllers/call-controller";
import * as IvrController from "../../controllers/ivr-controller";

// Company
import * as CompanyController from "../../controllers/company-controller";

// Documents
import * as DocumentsController from "../../controllers/documents/controller";

// Server
import Server from "../../controllers/server";

routes
    // call
    .post('/token', TokenController.getToken)
    .post('/outgoing', CallController.handleOutgoingCall)
    .post('/direct-incoming', twilio.webhook({ validate: false }), CallController.handleDirectIncomingCall)
    .post('/enqueue-incoming', twilio.webhook({ validate: false }), CallController.handleIncomingQueuedCall)
    .post('/incoming', twilio.webhook({ validate: false }), CallController.handleIncomingCall)
    .post('/dequeue-incoming', twilio.webhook({ validate: false }), CallController.handleDequeueCall)
    .post('/goodbye', CallController.handleFinishCall)
    .post('/call', twilio.webhook({ validate: false }), CallController.handleCall)

    // ivr
    .post('/welcome', twilio.webhook({ validate: false }), IvrController.goToWelcome)
    .post('/menu', twilio.webhook({ validate: false }), IvrController.goToMenu)
    .post('/planets', twilio.webhook({ validate: false }), IvrController.goToPlanets)

    // company
    .get('/companies', CompanyController.listCompanies)
    .post('/create-company', CompanyController.createCompany)
    .get('/company/find-name', CompanyController.findCompanyByName)
    .get('/company/find-id', CompanyController.findCompanyById)
    .post('/company-queues', CompanyController.updateCompanyQueues)
    .put('/company-queues', CompanyController.updateCompanyQueues)
    .post('/company-phone', CompanyController.updateCompanyPhone)
    .put('/company-phone', CompanyController.updateCompanyPhone)
    .post('/company-welcome', CompanyController.updateCompanyWelcome)
    .put('/company-welcome', CompanyController.updateCompanyWelcome)
    .post('/company-menu', CompanyController.updateCompanyMenu)
    .put('/company-menu', CompanyController.updateCompanyMenu)
    .post('/company-messages', CompanyController.updateCompanyMessages)
    .put('/company-messages', CompanyController.updateCompanyMessages)

    // documents
    .post('/about-to-connect', DocumentsController.toConnect)
    .post('/wait-room', DocumentsController.toWaitRoom)
    .post('/dequeue-action', DocumentsController.toActionTake)

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