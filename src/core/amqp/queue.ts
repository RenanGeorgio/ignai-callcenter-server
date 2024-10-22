import { createClient } from "redis";
import { redisClient } from "../redis";
import { data } from "./data";


export class QueueData {
  static _instance: QueueData;
  name: string;
  redisPublisher: ReturnType<typeof createClient>;

  constructor(name: string = "on_call") {
    this.name = name;
    this.redisPublisher = redisClient.duplicate();

    this.init();
  }

  private async init(): Promise<void> {
    try {
      await this.redisPublisher.connect();

      await this.redisPublisher.ft.create('idx:animals', { 
        data
      }, {
        ON: 'HASH',
        PREFIX: 'noderedis:animals'
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

  public async setData(): Promise<void> {
    try {
      await this.redisPublisher.hSet('noderedis:animals:1', {name: 'Fluffy', species: 'cat', age: 3});
    } catch (error: any) {
      // @ts-ignore
      console.error(error);
    }
  }

  public async searchData(): Promise<void> {
    try {
      await this.redisPublisher.hSet('noderedis:animals:1', {name: 'Fluffy', species: 'cat', age: 3});
      const results = await this.redisPublisher.ft.search(
        'idx:animals', 
        '@species:{dog}',
        {
          SORTBY: {
            BY: 'age',
            DIRECTION: 'DESC' // or 'ASC (default if DIRECTION is not present)
          }
        }
      );
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