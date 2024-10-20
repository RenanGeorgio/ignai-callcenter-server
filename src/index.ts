import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config()

import { serverHttp, queueHttp } from "./core/http";
import { listenerQueue } from "./core/amqp/listener";
import mongoose from "./database";
import "./websocket";

import config from "./config/env";

const queue_port = config.queue.queuePort;

queueHttp.listen(queue_port, () => {
  // @ts-ignore
  console.log("queue server is running");
});

const port = config.app.port;

serverHttp.listen(port, () =>  {
  // @ts-ignore
  console.log('Server is running')
});

serverHttp.on('error', (error: any) => {
  if (error?.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error?.code) {
    case 'EACCES':
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
});

serverHttp.on('listening', () => {
  //client.enqueue('default');

  /*workspace.setup().then(function (data) {
    app.set('workerInfo', data[0]);
    app.set('workspaceInfo', data[1]);
  })
  .catch((error: any) => {
    console.error(error?.message);
    throw error;
  });*/
});

listenerQueue();

mongoose.connection.once('open', () => {
  const result = mongoose.connection.readyState;
  // @ts-ignore
  console.log('Connected to MongoDB', result);

  /*
  const changeStream = User.watch();

  changeStream.on('change', (change) => {
    console.log('Change detected:', change);

    // Handle different types of changes (insert, update, delete, etc.)
    switch (change.operationType) {
      case 'insert':
        console.log('New document inserted:', change.fullDocument);
        break;
      case 'update':
        console.log('Document updated:', change.updateDescription);
        break;
      case 'delete':
        console.log('Document deleted with _id:', change.documentKey._id);
        break;
      default:
        console.log('Other change type:', change);
    }
  });*/
});
/*
<Say> — Read text to the caller
<Play> — Play an audio file for the caller
<Dial> — Add another party to the call
<Record> — Record the caller's voice
<Gather> — Collect digits the caller types on their keypad

<Hangup> — Hang up the call.
<Enqueue> — Add the caller to a queue of callers.
<Leave> — Remove a caller from a queue of callers.
<Pause> — Wait before executing more instructions.
<Redirect> — Redirect call flow to a different TwiML document.
<Refer> — Twilio initiates SIP REFER towards IP communication infrastructure.
<Reject> — Decline an incoming call without being billed.

<VirtualAgent> — Build AI-powered Conversational IVR.
*/