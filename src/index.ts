import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config()

import config from "./config/env";
import { serverHttp } from "./core/http";
import "./websocket";

const port = config.app.port || 6060;
serverHttp.listen(port, () =>  console.log('Server is running'));