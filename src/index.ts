import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config()

import config from "./config/env";
import { serverHttp } from "./core/http";
import "./websocket";

const port = config.app.port || 6060;
serverHttp.listen(port, () =>  console.log('Server is running'));

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