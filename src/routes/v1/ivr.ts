import { Router } from "express";

const routes = Router();

// Call
import * as IvrController from "../../controllers/ivr-controller";

// Server
import Server from "../../controllers/server";

routes
    // ivr
    .post('/welcome', IvrController.goToWelcome)
    .post('/menu', IvrController.goToMenu)
    .post('/planets', IvrController.goToPlanets)

    // Test Server
    .get('/server', Server.status)

export { routes };