import { Obj, QueueSubscriber } from "../../types";

export interface ISubscriber {
  sub: QueueSubscriber
  userId: string
}

export class SubscribersService {
  static _instance: SubscribersService;
  subscribers: Obj;

  constructor() {
    this.subscribers = {};
  }

  public sentData({ sub, userId }: ISubscriber) {
    const { companyId, queueId, res } = sub;
    const subscriber: QueueSubscriber = sub;
    
    this.subscribers[userId] = subscriber;
  }

  public unSubscriber(userId: string): void {
    delete this.subscribers[userId];
  }

  public getData(botName: string = "ignaibot"): void {
    directLine.activity$
        .filter(activity => activity.type === ActivityTypes.Message && activity.from.id === botName)
        .subscribe(
            (message) => {
                console.log("Activity added to BotService queue.")
                console.log(message)
                queue.add("BotService", { message });
            }
        )
  }

  static getInstance(): SubscribersService {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new SubscribersService();
    return this._instance;
  }
}