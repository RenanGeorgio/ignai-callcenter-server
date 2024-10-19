import http from "http";
import { Server } from "socket.io";

import app from "../server";
import queueApp from "../queue-server";
import { QueueAmqpService } from "./amqp/amqp-queue";

const serverHttp = http.createServer(app);
const queueHttp = http.createServer(queueApp);

const amqpService = QueueAmqpService.getInstance();

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

export { serverHttp, io, io_server, queueHttp, amqpService };