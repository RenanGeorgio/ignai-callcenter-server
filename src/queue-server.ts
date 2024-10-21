import express, { Request, Response } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import RedisStore from "connect-redis";
import { redisClient } from "./core/redis";
import { queueRoutes } from "./routes";
import { QueueAmqpService } from "./core/amqp/connect-queue";
import { CallAmqpService } from "./core/amqp/call-queue";

const store = new RedisStore({ client: redisClient, prefix: "bot:" });

const customSession = session({
  secret: process.env.SESSION_TOKEN ? process.env.SESSION_TOKEN.replace(/[\\"]/g, '') : "secret",
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false }
})

const queueApp = express();

queueApp.use(cors());

queueApp.use(
  bodyParser.json({
    verify: function (req: Request, res: Response, buf: any) {
      req.rawBody = buf;
    }
  })
);

queueApp.use(bodyParser.urlencoded({ extended: false }));

queueApp.use(express.json());

queueApp.use(express.urlencoded({ extended: true }));

queueApp.use(cookieParser());

queueApp.use(customSession);

const amqpService = QueueAmqpService.getInstance("callcenter");
const onCallService = CallAmqpService.getInstance("oncall");

// routes
queueApp.use(queueRoutes);

export {
  queueApp,
  amqpService,
  onCallService
}