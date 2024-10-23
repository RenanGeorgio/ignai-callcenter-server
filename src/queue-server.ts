import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import { queueRoutes } from "./routes";
import { QueueAmqpService } from "./core/amqp/connect-queue";
import { CallAmqpService } from "./core/amqp/call-queue";

const queueApp = express();

queueApp.use(cors());

queueApp.use(bodyParser.urlencoded({ extended: false }));

queueApp.use(express.json());

queueApp.use(express.urlencoded({ extended: true }));

queueApp.use(cookieParser());

const amqpService = QueueAmqpService.getInstance("callcenter");
const onCallService = CallAmqpService.getInstance("oncall");

// routes
queueApp.use(queueRoutes);

export {
  queueApp,
  amqpService,
  onCallService
}