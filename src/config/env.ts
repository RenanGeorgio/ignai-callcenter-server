import dotenv from "dotenv";

dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 6060,
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