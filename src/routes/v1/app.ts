import { Router } from "express";

const routes = Router();

// Token
import * as TokenController from "../../controllers/token-controller";

// Call
import * as CallController from "../../controllers/call-controller";

// Server
import Server from "../../controllers/server";

routes
    // call
    .post('/token', TokenController.getToken)
    .post('/call', CallController.handleOutgoingCall)
    .post('/incoming', CallController.handleIncomingCall)

    // Test Server
    .get('/server', Server.status)

export default routes;