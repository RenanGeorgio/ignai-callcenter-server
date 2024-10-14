import { Obj, QueueSubscriber } from "types";

interface ISubscriber {
    sub: QueueSubscriber
    userId: string
}

export class DirectlineService {
  static _instance: DirectlineService;
  subscribers: Obj;

  constructor() {
    this.subscribers = {};
  }

  public sentData({ sub, userId }: ISubscriber) {
    const { companyId, queueId, res } = sub;
    const subscriber: QueueSubscriber = sub;
    
    this.subscribers[userId] = subscriber;
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

  static getInstance(): DirectlineService {
      if (this._instance) {
          return this._instance;
      }

      this._instance = new DirectlineService();
      return this._instance;
  }
}