import http from "http";
import { Server } from "socket.io";
import app from "../server";
import { queueApp, amqpService } from "../queue-server";
import { ListenerQueue } from "./amqp/listener";

const serverHttp = http.createServer(app);
const queueHttp = http.createServer(queueApp);

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

const listenerQueue = ListenerQueue.getInstance("callcenter");

export { serverHttp, io, io_server, queueHttp, amqpService, listenerQueue };