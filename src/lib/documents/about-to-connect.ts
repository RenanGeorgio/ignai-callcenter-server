import twilio from "twilio";

/**
 * Retorna Twiml
 * @return {String}
 */
export default function aboutToConnect(): string {
  const client = new twilio.twiml.VoiceResponse();

  client.say(
    { 
      language: 'pt-BR',
      voice: 'Polly.Ricardo',
      loop: 1
    },
    'Você esta sendo direcionado para um atendente em instantes.'
  );

  return client.toString();
}