import amqp from "amqplib";
import config from "../../config/env";

export async function listenerQueue() {
  try {
    const connection = await amqp.connect(config.queue.amqp);
    const channel = await connection.createChannel();
    
    // PESQUISAR O PQ DISSO
    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue("test-queue", { durable: true });
    
    channel.consume(
      "test-queue", 
      (data: any) => {
        if (data) {
          // @ts-ignore
          console.log("Data received : ", `${Buffer.from(data.content)}` );
          channel.ack(data);
        }
      },
      { noAck: true } // PQ DISSO?
    );
  } catch (error: any) {
    // @ts-ignore
    console.warn(error);
  }
}