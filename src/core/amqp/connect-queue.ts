import amqp, { Channel, Connection } from "amqplib";
import config from "../../config/env";
import { QueueAgentDTO } from "./types";

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}

export class QueueAmqpService {
  static _instance: QueueAmqpService;
  channel: Channel | undefined;
  connection: Connection | undefined;
  queue: string;

  constructor(queueName: string = "callcenter") {
    this.queue = queueName;

    this.init();
  }

  private async init(): Promise<void> {
    try {
      this.connection = await amqp.connect(config.amqp.uri());
      this.channel = await this.connection.createChannel();   

      await this.channel.assertQueue(this.queue, { durable: true });
    } catch (error: any) {
      // @ts-ignore
      console.log(error);
    }
  }

  public async sendData(data: QueueAgentDTO): Promise<void> {
    const correlationId = generateUuid();
    const messageId = generateUuid();
    try {
      // @ts-ignore
      this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)), {
        persistent: true,
        contentType: 'application/json',
        correlationId: correlationId,
        messageId: messageId
      });

      if (this.channel){
        await this.channel.close();
      }    
      
      if (this.connection){
        await this.connection.close();
      }
    } catch (error: any) {
      // @ts-ignore
      console.log(error);
    }
  }

  static getInstance(queueName: string): QueueAmqpService {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new QueueAmqpService(queueName);
    return this._instance;
  }
}