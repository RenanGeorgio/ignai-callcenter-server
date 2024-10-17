import twilio from "twilio";

/**
 * Retorna Twiml
 * @return {String}
 */
export default function enqueueFailed(): string {
  const client = new twilio.twiml.VoiceResponse();

  client.say(
    { 
      language: 'pt-BR',
      voice: 'Polly.Ricardo',
      loop: 1
    },
    'Falha em entrar na fila de espera.'
  );

  return client.toString();
}