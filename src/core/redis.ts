import * as redis from "redis";
import config from "../config/env";

const redisConfig: any = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
};

const redisClient = redis.createClient({
  password: redisConfig.password.replace(/[\\"]/g, ''),
  disableOfflineQueue: true,
  pingInterval: 60000,
  socket:{
    host: redisConfig.host.replace(/[\\"]/g, ''),
    port: parseInt(redisConfig.port.replace(/[\\"]/g, '')),
    tls: true
  },    
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

export { redisClient, redisConfig };