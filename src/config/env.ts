import dotenv from "dotenv";

dotenv.config();

const config = {
  app: {
    port: process.env.PORT ? parseInt(process.env.PORT.replace(/[\\"]/g, '')) : 6061,
    database: process.env.MONGO_URL ? process.env.MONGO_URL.replace(/[\\"]/g, '') : '',
  },
  queue: {
    port: process.env.QUEUE_PORT ? parseInt(process.env.QUEUE_PORT.replace(/[\\"]/g, '')) : 6061,
    maxSize: 10,
  },
  amqp: {
    host: process.env.AMQP_HOST ? process.env.AMQP_HOST.replace(/[\\"]/g, '') : 'localhost',
    port: process.env.AMQP_PORT ? parseInt(process.env.AMQP_PORT.replace(/[\\"]/g, '')) : 5672,
    tls: process.env.AMQP_TLS ? (/true/).test(process.env.AMQP_TLS.replace(/[\\"]/g, '').toLowerCase()) : false,
    user: process.env.AMQP_USER ? process.env.AMQP_USER.replace(/[\\"]/g, '') : undefined,
    password: process.env.AMQP_PASSWORD ? process.env.AMQP_PASSWORD.replace(/[\\"]/g, '') : undefined,
    uri: () => (config.amqp.tls ? "amqps://" : "amqp://") + (config.amqp.user ? config.amqp.user + ":" + config.amqp.password + '@' : '') + config.amqp.host + ":" + config.amqp.port 
  },
  redis: {
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST.replace(/[\\"]/g, '') : 'localhost',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT.replace(/[\\"]/g, '')) : 6379,
    password: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD.replace(/[\\"]/g, '') : undefined,
    tls: process.env.REDIS_TLS ? (/true/).test(process.env.REDIS_TLS.replace(/[\\"]/g, '').toLowerCase()) : false,
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID ? process.env.TWILIO_ACCOUNT_SID.replace(/[\\"]/g, '') : "",
    authToken: process.env.TWILIO_AUTH_TOKEN ? process.env.TWILIO_AUTH_TOKEN.replace(/[\\"]/g, '') : "",
    apiKey: process.env.TWILIO_API_KEY ? process.env.TWILIO_API_KEY.replace(/[\\"]/g, '') : "",
    apiSecret: process.env.TWILIO_API_SECRET ? process.env.TWILIO_API_SECRET.replace(/[\\"]/g, '') : "",
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID ? process.env.TWILIO_TWIML_APP_SID.replace(/[\\"]/g, '') : "",
    incomingAllow: process.env.TWILIO_ALLOW_INCOMING_CALLS ? process.env.TWILIO_ALLOW_INCOMING_CALLS.replace(/[\\"]/g, '') : 'true',
    callerId: process.env.FROM_NUMBER ? process.env.FROM_NUMBER.replace(/[\\"]/g, '') : "",
    agentId: process.env.AGENT_ID ? process.env.AGENT_ID.replace(/[\\"]/g, '') : ""
  },
  userControl: {
    url: process.env.USER_CONTROLL ? process.env.USER_CONTROLL.replace(/[\\"]/g, '') : "",
  },
  email: {
    host: process.env.EMAIL_HOST ? process.env.EMAIL_HOST.replace(/[\\"]/g, '') : "localhost",
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT.replace(/[\\"]/g, '')) : 465,
    username: process.env.EMAIL_USERNAME ? process.env.EMAIL_USERNAME.replace(/[\\"]/g, '') : undefined,
    password: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.replace(/[\\"]/g, '') : undefined
  }
};

export default config;