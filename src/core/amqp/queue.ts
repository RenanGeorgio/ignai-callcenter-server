import { createClient } from "redis";
import { redisClient } from "../redis";
import { data } from "./data";
import { QueueAgentDTO } from "./types";
import { Obj } from "../../types";


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

      const options: any = {
        ON: 'JSON',
        PREFIX: 'data:on_call:'
      }

      await this.redisPublisher.ft.create('idx:on_call:', data, options);
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
      await this.redisPublisher.subscribe(this.name, (message: any) => {
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

  public async setData(data: QueueAgentDTO): Promise<void> {
    try {
      this.size = this.size + 1;
      const index: string = 'data:on_call:' + data.client;
      //await this.redisPublisher.hSet('data:on_call:1', {name: 'Fluffy', species: 'cat', age: 3});
      await this.redisPublisher.hSet(index, {
        'client': data.client, 
        'status': data.status, 
        'deQueuedTime': data.queuedTime, 
        'queuedTime': data.queuedTime 
      });
    } catch (error: any) {
      // @ts-ignore
      console.error(error);
    }
  }

  public async removeData(data: QueueAgentDTO): Promise<void> { // TODO: colocar função de remoção
    try {
      const index = 'data:on_call:' + data.client;
      //await this.redisPublisher.hSet('data:on_call:1', {name: 'Fluffy', species: 'cat', age: 3});
      await this.redisPublisher.hDel(index, ['client', 'status', 'deQueuedTime', 'queuedTime']);
      this.size = this.size - 1;
    } catch (error: any) {
      // @ts-ignore
      console.error(error);
    }
  }

  public async searchData(value: string, key: string): Promise<QueueAgentDTO | null> {
    try {
      const index = '@CallSid:{' + value + '}';

      const search = await this.redisPublisher.ft.search(
        'idx:on_call:', 
        index,
        {
          SORTBY: {
            BY: key,
            DIRECTION: 'DESC'
          }
        }
      );

      let results: any = []
      if (search.total >= 1){
        for (const i of search.documents) {
          results.push(i.value)
        }
      }

      return results;
    } catch (error: any) {
      // @ts-ignore
      console.error(error);
      return null;
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