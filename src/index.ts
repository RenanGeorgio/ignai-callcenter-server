import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config()

import config from "./config/env";
import { serverHttp } from "./core/http";
import "./websocket";

const port = config.app.port || 6060;

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
  const addr = serverHttp.address();

  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  debug('Listening on ' + bind);
  console.log("Configuring a Twilio's TaskRouter Workspace");
  workspace.setup().then(function (data) {
    app.set('workerInfo', data[0]);
    app.set('workspaceInfo', data[1]);
    console.log(data)
    console.log('Application configured!');
    console.log('Call your Twilio number at: ' + process.env.TWILIO_NUMBER);
  })
  .catch((error: any) => {
    console.error(error?.message);
    throw error;
  });
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