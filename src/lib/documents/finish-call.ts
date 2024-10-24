import twilio from "twilio";
import config from "../../config/env";

/**
 * Retorna Twiml
 * @return {String}
 */
export default function finishCall(id?: string): string {
  try {
    const client = new twilio.twiml.VoiceResponse();

    client.say(
      { 
        language: 'pt-BR',
        voice: 'Polly.Ricardo',
        loop: 1
      },
      'Obrigado por ligar.'
    );

    return client.toString();
  } catch (err: any) {
    throw new Error(err);
  }
}
/*
export default function finishCall(id: string): string {
  const accountSid = config.twilio.accountSid;
  const authToken = config.twilio.authToken;
  
  try {
    const sid = id;

    const checkQueue = async (queueId: string) => {
      let size: number = 1;
      let queueName: string = "";

      const twml = twilio(accountSid, authToken);

      const queue = await twml.queues(queueId).fetch();

      if (queue) {
        size = queue['current_size'];
        queueName = queue['friendly_name'];
      }

      if (size === 0) {
        removeQueue(queueName);
      }
    }

    const client = new twilio.twiml.VoiceResponse();

    client.say(
      { 
        language: 'pt-BR',
        voice: 'Polly.Ricardo',
        loop: 1
      },
      'Obrigado por ligar.'
    );

    checkQueue(sid);

    return client.toString();
  } catch (err: any) {
    throw new Error(err);
  }
}*/