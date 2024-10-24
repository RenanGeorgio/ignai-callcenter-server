import * as redis from "redis";
import config from "../config/env";

const redisClient = redis.createClient({
  disableOfflineQueue: true,
  pingInterval: 60000,
  socket: {
    host: config.redis.host,
    port: config.redis.port,
    tls: config.redis.tls
  },
  ...(config.redis.password ? { password: config.redis.password } : {}),
});

redisClient.on("error", function (err: any) {
  console.log("Could not establish a connection with redis. " + err);
});

redisClient.on("connect", function (err: any) {
  console.log("Connected to redis successfully");
});

(async () => {
  await redisClient.connect().catch(
    (err: any) => {
      console.log(err);
    })
}
)();

export { redisClient };
