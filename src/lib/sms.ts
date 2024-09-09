import twilio from "twilio";
import config from "../config/env";

export function sendSms(caller, twilioNumber) {
  const accountSid = config.twilio.accountSid;
  const authToken = config.twilio.authToken;

  return twilio.messages.create({
    body: "There's always money in the banana stand.",
    from: twilioNumber,
    to: caller,
  }).then()
    .catch(function(error) {
      if (error.code === 21614) {
        // @ts-ignore
        console.log("Uh oh, looks like this caller can't receive SMS messages.")
      }
    })
    .done();
}