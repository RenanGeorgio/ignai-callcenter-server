import "reflect-metadata";
import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import pino from "express-pino-logger";
import routes from "./routes";

const { VoiceResponse } = require("twilio").twiml;

const app = express();

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended : false }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(pino());

app.use(routes);

app.use(express.static(path.join(__dirname, 'public')));

// notFound
app.use((req, res, next) => {
  const error = new Error('Not found');

  // @ts-ignore
  error.status = 404;

  next(error);
});

// catch all
app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({ error: error.message})
});

export default app ;