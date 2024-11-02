import twilio from "twilio";

/**
 * Retorna Twiml
 * @return {String}
 */
export default function aboutToPickup(): string {
  const client = new twilio.twiml.VoiceResponse();

  client.say(
    { 
      language: 'pt-BR',
      voice: 'Polly.Ricardo',
      loop: 1
    },
    'Você esta prestes a ser atendido.'
  );

  return client.toString();
}