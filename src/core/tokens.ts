import twilio from "twilio";

const AccessToken = twilio.jwt.AccessToken;
const { ChatGrant, VoiceGrant } = AccessToken;

// @ts-ignore
const generateToken = (config, identity) => {
  return new AccessToken(config.twilio.accountSid, config.twilio.apiKey, config.twilio.apiSecret, 
    {
      identity,
    }
  );
};

// @ts-ignore
export const chatToken = (identity, config) => {
  const chatGrant = new ChatGrant({
    serviceSid: config.twilio.chatService
  });

  const token = generateToken(config, identity);
  token.addGrant(chatGrant);
  //token.identity = identity;

  return token;
};

// @ts-ignore
export const voiceToken = (identity, config) => {
  let voiceGrant;

  if (typeof config.twilio.outgoingApplicationSid !== 'undefined') {
    voiceGrant = new VoiceGrant({
      outgoingApplicationSid: config.twilio.outgoingApplicationSid,
      incomingAllow: config.twilio.incomingAllow
    });
  } else {
    voiceGrant = new VoiceGrant({
      incomingAllow: config.twilio.incomingAllow
    });
  }

  const token = generateToken(config, identity);
  token.addGrant(voiceGrant);
  //token.identity = identity;

  return token;
};