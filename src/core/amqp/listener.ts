import amqp, { Channel, Connection } from "amqplib";
import { createClient } from "redis";
import { redisClient } from "../redis";
import config from "../../config/env";
import { QueueData } from "./queue";
import { QueueAgentDTO } from "./types";


export class ListenerQueue {
  static _instance: ListenerQueue;
  channel: Channel | undefined;
  connection: Connection | undefined;
  queue: string;
  redisClientStore: ReturnType<typeof createClient> = redisClient.duplicate();
  redisPublisher: QueueData;

  constructor(queueName: string = "callcenter") {
    this.queue = queueName;
    this.redisPublisher = QueueData.getInstance("on_call");
  }

  public async subscribe(): Promise<void> {
    try {
      const connection = await amqp.connect(config.amqp.uri());
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
            const content = Buffer.from(data.content);
            console.log("Data received : ", `${content}` );

            const value: QueueAgentDTO = JSON.parse(content);
            const company = value.filterCompanyId;
            const key = value.eventData.CallSid;

            const result = await this.redisClientStore.hSet(company, key, content);
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
      const messages = await this.redisClientStore.lRange("queued_calls", 0, -1);
      return messages;
    } catch (error: any) {
      // @ts-ignore
      console.error("Error retrieving messages: ", error);
      return [];
    }
  }

  public async findCall(company: string , search: string): Promise<QueueAgentDTO | null> {
    try {
      const foundMessage = await this.redisClientStore.hGet(company, search);

      if (foundMessage) {
        this.completeTasksAndDeleteMessage(company, search);
        this.setOnCallMessage(foundMessage);

        const value: QueueAgentDTO = JSON.parse(foundMessage);

        return value;
      } else {
        return null;
      }
    } catch (error: any) {
      // @ts-ignore
      console.error("Error searching messages: ", error);
      return null;
    }
  }

  public async listCalls(company: string): Promise<string | null> {
    try {
      const res = await this.redisClientStore.hGetAll(company);

      if (res) {
        return res;
      } else {
        return null;
      }
    } catch (error: any) {
      // @ts-ignore
      console.error("Error searching messages: ", error);
      return null;
    }
  }

  private async completeTasksAndDeleteMessage(company: string , search: string): Promise<void> {
    try {
      await this.redisClientStore.hDel(company, search);
    } catch (error: any) {
      // @ts-ignore
      console.error("Error deleting message after tasks: ", error);
    }
  }

  private async setOnCallMessage(value: string): Promise<void> {
    try {
      const msg: QueueAgentDTO = JSON.parse(value);
      await this.redisPublisher.setData(msg);
    } catch (error: any) {
      // @ts-ignore
      console.error(error);
    }
  }

  public async setRequeueCall(callid: string, company: string): Promise<void> {
    try {
      const result: QueueAgentDTO | null = await this.redisPublisher.searchData(callid, company);

      if (result) {
        await this.redisPublisher.removeData(result);

        const company = result.filterCompanyId;
        const key = result.eventData.CallSid;

        await this.redisClientStore.hSet(company, key, result);
      }
      
      return;
    } catch (error: any) {
      // @ts-ignore
      console.error(error);
      return;
    }
  }

  public async setFinishCall(callid: string, company: string): Promise<void> {
    try {
      const result: QueueAgentDTO | null = await this.redisPublisher.searchData(callid, company);

      if (result) {
        await this.redisPublisher.removeData(result);
      }
      
      return;
    } catch (error: any) {
      // @ts-ignore
      console.error(error);
      return;
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