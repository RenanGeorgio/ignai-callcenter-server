import twilio from "twilio";

/**
 * Retorna Twiml
 * @return {String}
 */
export default function waitMusic(): string {
  const client = new twilio.twiml.VoiceResponse();
  client.play('http://com.twilio.sounds.music.s3.amazonaws.com/MARKOVICHAMP-Borghestral.mp3');

  return client.toString();
}