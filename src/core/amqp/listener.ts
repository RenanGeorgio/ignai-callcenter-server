import amqp, { Channel } from "amqplib";
import { createClient } from "redis";
import { redisClient } from "../redis";
import config from "../../config/env";


export class ListenerQueue {
  static _instance: ListenerQueue;
  channel: Channel;
  connection: any;
  queue: string;
  redisClient: ReturnType<typeof createClient> = redisClient;
  redisPublisher: ReturnType<typeof createClient>;

  constructor(queueName: string = "callcenter") {
    this.queue = queueName;
    this.redisPublisher = redisClient.duplicate();
  }

  public async subscribe(): Promise<void> {
    try {
      await this.redisPublisher.connect();

      const connection = await amqp.connect(config.queue.amqp);
      const channel = await connection.createChannel();
      
      // @ts-ignore
      process.once("SIGINT", async () => {
        await channel.close();
        await connection.close();
      });
  
      await channel.assertQueue(this.queue, { durable: true });
      
      channel.consume(
        this.queue, 
        async (data: any) => {
          if (data) {
            // @ts-ignore
            console.log("Data received : ", `${Buffer.from(data.content)}` );

            const result = await this.redisClient.rPush("queued_calls", data.content); // TO-DO: HSET
            if (result) {
              channel.ack(data);
            }
          }
        },
        { noAck: false }
      );
    } catch (error: any) {
      // @ts-ignore
      console.warn(error);
    }
  }

  private async getMessages(): Promise<string[]> {
    try {
      const messages = await this.redisClient.lRange("queued_calls", 0, -1);
      return messages;
    } catch (error: any) {
      // @ts-ignore
      console.error("Error retrieving messages: ", error);
      return [];
    }
  }

  public async findMessage(searchValue: string): Promise<string | null> {
    try {
      const messages = await this.getMessages();

      const foundMessage = messages.find((msg) => msg.includes(searchValue));

      if (foundMessage) {
        this.completeTasksAndDeleteMessage(foundMessage);
        return foundMessage;
      } else {
        return null;
      }
    } catch (error: any) {
      // @ts-ignore
      console.error("Error searching messages: ", error);
      return null;
    }
  }

  private async completeTasksAndDeleteMessage(message: string): Promise<void> {
    try {
      await this.redisClient.lRem("queued_calls", 1, message);
    } catch (error: any) {
      // @ts-ignore
      console.error("Error deleting message after tasks: ", error);
    }
  }

  public async setOnCallMessage(value: string): Promise<string | null> {
    try {
      const result = await this.redisPublisher.rPush("on_call", value);
      return result;
    } catch (error: any) {
      // @ts-ignore
      console.error(error);
      return null;
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