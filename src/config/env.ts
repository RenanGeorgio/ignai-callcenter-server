import dotenv from "dotenv";

dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 6060,
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    apiKey: process.env.TWILIO_API_KEY,
    apiSecret: process.env.TWILIO_API_SECRET,
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
    incomingAllow: process.env.TWILIO_ALLOW_INCOMING_CALLS === 'true',
    callerId: process.env.FROM_NUMBER,
    agentId: process.env.AGENT_ID
  }
};

export default config;