import http from "http";
import { Server } from "socket.io";
import app from "../server";

const serverHttp = http.createServer(app);

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

export { serverHttp, io, io_server };