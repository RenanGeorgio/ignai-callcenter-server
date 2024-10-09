import twilio from "twilio";

export  default function generateQueue(queues: string[], id: string) {
  const client = new twilio.twiml.VoiceResponse();

  for (const queue in queues) {
    const neuQueue = queue + "-01-" + id + "-01";
    client.enqueue(neuQueue);
  }

  const queueDefault = "default-" + id;
  client.enqueue(queueDefault);

  return client.toString();
}