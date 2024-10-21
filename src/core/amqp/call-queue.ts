import amqp, { Channel } from "amqplib";
import config from "../../config/env";

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}

export class CallAmqpService {
  static _instance: CallAmqpService;
  channel: Channel;
  connection: any;
  queue: string;

  constructor(queueName: string = "oncall") {
    this.queue = queueName;

    this.init();
  }

  private async init(): Promise<void> {
    try {
      // amqp.connect('amqp://localhost', {clientProperties: {connection_name: 'myFriendlyName'}});
      this.connection = await amqp.connect(config.queue.amqp);
      this.channel = await this.connection.createChannel();
      
      await this.channel.assertQueue(this.queue, { durable: true });
    } catch (error: any) {
      // @ts-ignore
      console.log(error);
    }
  }

  public async sendData(data: any): Promise<void> {
    const correlationId = generateUuid();
    try {
      // @ts-ignore
      await this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)), {
        persistent: true,
        contentType: 'application/json',
        replyTo: 'oncall',
        correlationId: correlationId,
        messageId: correlationId
      });
          
      await this.channel.close();
      await this.connection.close();
    } catch (error: any) {
      // @ts-ignore
      console.log(error);
    }
  }

  static getInstance(queueName: string): CallAmqpService {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new CallAmqpService(queueName);
    return this._instance;
  }
}