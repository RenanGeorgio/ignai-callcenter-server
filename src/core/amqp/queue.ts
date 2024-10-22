import { createClient } from "redis";
import { redisClient } from "../redis";
import { data } from "./data";


export class QueueData {
  static _instance: QueueData;
  name: string;
  redisPublisher: ReturnType<typeof createClient>;
  size: number;

  constructor(name: string = "on_call") {
    this.name = name;
    this.size = 0;
    this.redisPublisher = redisClient.duplicate();

    this.init();
  }

  private async init(): Promise<void> {
    try {
      await this.redisPublisher.connect();

      await this.redisPublisher.ft.create('idx:on_call', { 
        data
      }, {
        ON: 'HASH',
        PREFIX: 'data:on_call'
      });
    } catch (error: any) {
      if (error.message === 'Index already exists') {
        // @ts-ignore
        console.log('Index exists already, skipped creation.');
      } else {
        // @ts-ignore
        console.error(error);
      }
    }
  }

  public async subscriber(): Promise<void> {
    try {
      await this.redisPublisher.subscribe(this.name, (message: string) => {
        // @ts-ignore
        console.log(`Channel1 subscriber collected message: ${message}`);
      }, true);
    } catch (error: any) {
      // @ts-ignore
      console.error(error);
    }
  }

  public async publisher(message: string): Promise<void> {
    try {
      await this.redisPublisher.publish(this.name, message);;
    } catch (error: any) {
      // @ts-ignore
      console.error(error);
    }
  }

  public async setData(data: any): Promise<void> {
    try {
      this.size = this.size + 1;
      const index = 'data:on_call:' + this.size.toString();
      //await this.redisPublisher.hSet('data:on_call:1', {name: 'Fluffy', species: 'cat', age: 3});
      await this.redisPublisher.hSet(index, data);
    } catch (error: any) {
      // @ts-ignore
      console.error(error);
    }
  }

  public async searchData(value: string, key: string): Promise<void> {
    try {
      const index = '@eventData.CallSid:{' + value + '}';

      const results = await this.redisPublisher.ft.search(
        'idx:on_call', 
        index,
        {
          SORTBY: {
            BY: key,
            DIRECTION: 'DESC'
          }
        }
      );

      return results;
    } catch (error: any) {
      // @ts-ignore
      console.error(error);
    }
  }

  static getInstance(name: string): QueueData {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new QueueData(name);
    return this._instance;
  }
}