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
  
      /*channel.assertExchange(exchange, 'fanout', {
        durable: false
      });*/
      await channel.assertQueue(this.queue, { durable: true });
      //channel.prefetch(1); SUPORTA APENAS UMA POR VEZ
      //channel.bindQueue(q.queue, exchange, '');
      channel.consume(
        this.queue, 
        async (data: any) => {
          if (data) {
            // @ts-ignore
            console.log("Data received : ", `${Buffer.from(data.content)}` );

            const result = await this.redisClient.rPush("queue_messages", data.content);
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
      const messages = await this.redisClient.lRange("queue_messages", 0, -1);
      return messages;
    } catch (error: any) {
      // @ts-ignore
      console.error("Error retrieving messages: ", error);
      return [];
    }
  }

  private async findMessage(searchValue: string): Promise<string | null> {
    try {
      const messages = await this.getMessages();

      const foundMessage = messages.find((msg) => msg.includes(searchValue));
      return foundMessage || null;
    } catch (error: any) {
      // @ts-ignore
      console.error("Error searching messages: ", error);
      return null;
    }
  }

  public async findAndRemoveMessage(searchValue: string): Promise<string | null> {
    try {
      const messages = await this.getMessages();

      const foundMessage = messages.find((msg) => msg.includes(searchValue));

      if (foundMessage) {
        await this.redisClient.lRem("queue_messages", 1, foundMessage);
        console.log(`Removed message: ${foundMessage}`);
        return foundMessage;
      } else {
        console.log(`No message found containing "${searchValue}"`);
        return null;
      }
    } catch (error: any) {
      console.error("Error finding/removing message: ", error);
      return null;
    }
  }

  public async findAndModifyMessage(searchValue: string): Promise<string | null> {
    try {
      const foundMessage = this.findMessage(searchValue);

      if (!foundMessage) {
        return null;
      }

      await this.redisClient.watch("queue_messages");

      // Modify the found message (simulated here)
      const modifiedMessage = foundMessage + " - modified";

      // Perform other Redis operations atomically
      const transaction = this.redisClient.multi();

      // Apply the modification (you may choose to replace the message or handle it differently)
      transaction.lRem("queue_messages", 1, foundMessage); // Remove the old message
      transaction.rPush("queue_messages", modifiedMessage); // Add the modified message

      const result = await transaction.exec();

      if (result === null) {
        return null;
      }

      return modifiedMessage;
    } catch (error: any) {
      // @ts-ignore
      console.error("Error during optimistic locking: ", error);
      return null;
    }
  }

  // Complete external tasks and delete the message
  public async completeTasksAndDeleteMessage(message: string): Promise<void> {
    try {
      // Simulate external tasks being performed
      console.log(`Performing external tasks for message: ${message}`);
      
      // Once tasks are done, remove the modified message from Redis
      await this.redisClient.lRem("queue_messages", 1, message);
      console.log(`Message "${message}" deleted from Redis after tasks completion.`);
    } catch (error) {
      console.error("Error deleting message after tasks: ", error);
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