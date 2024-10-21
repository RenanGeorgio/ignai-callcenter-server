import amqp from "amqplib";
import config from "../../config/env";

export class QueueAmqpService {
  static _instance: QueueAmqpService;
  channel: any;
  connection: any;
  queue: string;

  constructor(queueName: string = "callcenter") {
    this.queue = queueName;

    this.init();
  }

  private async init(): Promise<void> {
    try {
      this.connection = await amqp.connect(config.queue.amqp);
      this.channel = await this.connection.createChannel();
      
      await this.channel.assertQueue(this.queue, { durable: true });
    } catch (error: any) {
      // @ts-ignore
      console.log(error);
    }
  }

  public async sendData(data: any): Promise<void> {
    try {
      // @ts-ignore
      await this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)), {
        persistent: true
      });
          
      await this.channel.close();
      await this.connection.close();
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