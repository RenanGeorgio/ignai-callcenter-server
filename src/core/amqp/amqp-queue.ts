export class QueueAmqpService {
  static _instance: QueueAmqpService;
  channel: any;
  connection: any;

  constructor() {
    this.channel;
    this.connection;
  }

  static getInstance(): QueueAmqpService {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new QueueAmqpService();
    return this._instance;
  }
}