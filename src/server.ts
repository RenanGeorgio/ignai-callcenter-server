import "reflect-metadata";
import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import pino from "express-pino-logger";
import routes from "./routes";

const app = express();

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended : false }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(pino());

app.use('/api', routes);

app.use(express.static(path.join(__dirname, 'public')));

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