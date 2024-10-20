import amqp from "amqplib";
import { QueueAmqpService } from "./amqp-queue";
import config from "../../config/env";

export async function connectQueue(amqpService: QueueAmqpService) {
  try {
    amqpService.connection = await amqp.connect(config.queue.amqp);
    amqpService.channel = await amqpService.connection.createChannel();
    
    await amqpService.channel.assertQueue("callcenter", { durable: true });
  } catch (error: any) {
    // @ts-ignore
    console.log(error);
  }
}