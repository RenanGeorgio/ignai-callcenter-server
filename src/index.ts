import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config()

import { serverHttp } from "./core/http";
import "./websocket";

const port = process.env.PORT || 6060;
serverHttp.listen(port, () =>  console.log('Server is running'));