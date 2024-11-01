import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import RedisStore from "connect-redis";
import flash from "connect-flash";
import path from "path";
import pino from "express-pino-logger";

import { routes } from "./routes";
import notifyEvents from "./events";
import { redisClient } from "./core/redis";


const store = new RedisStore({ client: redisClient, prefix: "calls:" });

const customSession = session({
  secret: process.env.SESSION_TOKEN ? process.env.SESSION_TOKEN.replace(/[\\"]/g, '') : "secret",
  name: 'callcenter',
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false }
});

const app = express();

// @ts-ignore
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.options('*', cors());

app.use(pino());

app.use(cookieParser());

app.use(customSession);

app.use(bodyParser.json({
  verify: (req: any, res: Response, buf: any) => {
    req.rawBody = buf;
  }
}));

app.use(bodyParser.urlencoded( { extended : false }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(flash());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.success = req.flash('success');
  res.locals.errors = req.flash('errors');

  next();
});

// SSE
app.use('/events', notifyEvents);

// routes
app.use(routes);

// notFound
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Not found');

  // @ts-ignore
  error.status = 404;

  next(error);
});

// catch all
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    console.trace(error);

    res.status(error.status || 500);
    res.render('error', {
      message: error.message,
      error: {}
    });
  } else {
    res.status(error.status || 500);
    res.json({ error: error.message});
  }
});

export default app;