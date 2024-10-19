import { amqpService } from "../core/http";

export const sendData = async (data: any) => {
  // send data to queue
  await amqpService.channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
      
  // close the channel and connection
  await amqpService.channel.close();
  await amqpService.connection.close();
}