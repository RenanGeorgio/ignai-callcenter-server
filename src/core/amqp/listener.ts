import amqp from "amqplib";
import config from "../../config/env";


export class ListenerQueue {
  static _instance: ListenerQueue;
  channel: any;
  connection: any;
  queue: string;

  constructor(queueName: string = "callcenter") {
    this.queue = queueName;
  }

  public async subscribe(): Promise<void> {
    try {
      const connection = await amqp.connect(config.queue.amqp);
      const channel = await connection.createChannel();
      
      // PESQUISAR O PQ DISSO
      process.once("SIGINT", async () => {
        await channel.close();
        await connection.close();
      });
  
      await channel.assertQueue(this.queue, { durable: true });
      //channel.prefetch(1); SUPORTA APENAS UMA POR VEZ
      channel.consume(
        this.queue, 
        (data: any) => {
          if (data) {
            // @ts-ignore
            console.log("Data received : ", `${Buffer.from(data.content)}` );
            channel.ack(data);
          }
        },
        { noAck: false }
      );
    } catch (error: any) {
      // @ts-ignore
      console.warn(error);
    }
  }

  static getInstance(queueName: string): ListenerQueue {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new ListenerQueue(queueName);
    return this._instance;
  }
}