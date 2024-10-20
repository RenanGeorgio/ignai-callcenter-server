import dotenv from "dotenv";

dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 6060,
    database: process.env.MONGO_URL ? process.env.MONGO_URL.replace(/[\\"]/g, '') : "",
  },
  queue: {
    queuePort: process.env.QUEUE_PORT || 5672,
    amqp: process.env.AMQP_URL || "amqp://localhost:5672"
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || '6379',
    password: process.env.REDIS_PASSWORD || '',
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
  }
};

export default config;