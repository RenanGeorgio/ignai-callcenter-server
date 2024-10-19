import amqp from "amqplib";
import { QueueAmqpService } from "./amqp-queue";

export async function connectQueue(amqpService: QueueAmqpService) {
  try {
    amqpService.connection = await amqp.connect("amqp://localhost:5672");
    amqpService.channel = await amqpService.connection.createChannel()
    
    // connect to 'test-queue', create one if doesnot exist already
    await amqpService.channel.assertQueue("test-queue")
  } catch (error: any) {
    // @ts-ignore
    console.log(error)
  }
}