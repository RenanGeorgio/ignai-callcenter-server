import http from "http";
import { Server } from "socket.io";
import twilio from "twilio";

import app from "../server";

const serverHttp = http.createServer(app);

const client = new twilio.twiml.VoiceResponse();

const io = new Server(serverHttp, {
  cors: {
    origin: '*',
  },
  path: '/queue',
});

const io_server = new Server(serverHttp, {
  cors: {
    origin: '*',
  },
  path: '/commands',
});

export { serverHttp, io, io_server, client };