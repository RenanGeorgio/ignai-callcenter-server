import "reflect-metadata";
import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import pino from "express-pino-logger";
import twilio from "twilio";
import { routes } from "./routes";
import { sendSms } from "./lib/sms";

const app = express();

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

app.all('/answer', (req: Request, res: Response) => {
  const caller = req.body.From;
  const twilioNumber = req.body.To;

  sendSms(caller, twilioNumber);

  const client = new twilio.twiml.VoiceResponse();
 
  client.say('Obrigado por ligar! Acabamos de lhe enviar uma mensagem com uma pista.');
  res.send(client.toString());
});

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