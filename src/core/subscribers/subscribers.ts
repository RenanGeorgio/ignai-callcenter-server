import { Obj, QueueSubscriber } from "../../types";

export interface ISubscriber {
  sub: QueueSubscriber
  userId: string
}

export class SubscribersService {
  static _instance: SubscribersService;
  subscribers: ISubscriber[];

  constructor() {
    this.subscribers = [];
  }

  public sentData({ sub, userId }: ISubscriber) {
    const subscriber = { sub, userId };
    
    this.subscribers.push(subscriber);
  }

  public unSubscriber(userId: string): void {
    const newSubscribers = this.subscribers.filter(subscriber => subscriber?.userId !== userId);
    this.subscribers = newSubscribers;
  }

  static getInstance(): SubscribersService {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new SubscribersService();
    return this._instance;
  }
}