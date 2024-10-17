import twilio from "twilio";

/**
 * Retorna Twiml
 * @return {String}
 */
export default function failedConnection(): string {
  const client = new twilio.twiml.VoiceResponse();

  client.say(
    { 
      language: 'pt-BR',
      voice: 'Polly.Ricardo',
      loop: 1
    },
    'Falha em estabelecer conexão.'
  );

  return client.toString();
}