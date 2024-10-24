import "reflect-metadata";
import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import RedisStore from "connect-redis";
import path from "path";
import pino from "express-pino-logger";
import { routes } from "./routes";
import notifyEvents from "./events";
import { redisClient } from "./core/redis";

const app = express();

const store = new RedisStore({ client: redisClient, prefix: "chatbot:" });

app.use(cors());

app.options('*', cors());

app.use(bodyParser.json({
  verify: (req: any, res: Response, buf: any) => {
    req.rawBody = buf;
  }
}));

app.use(bodyParser.urlencoded( { extended : false }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(pino());

app.use('/events', notifyEvents);

// routes
app.use(routes);

// @ts-ignore
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use(flash());

// middleware for flash message handling
app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('errors');
    next();
});
*/

// notFound
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Not found');

  // @ts-ignore
  error.status = 404;

  next(error);
});

// catch all
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500)
  res.json({ error: error.message})
});

export default app ;
