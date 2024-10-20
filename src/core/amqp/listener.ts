import amqp from "amqplib";

export async function listenerQueue() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
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