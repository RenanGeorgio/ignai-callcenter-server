import { ISubscriber, subscribersService } from "../../core/subscribers";

type DisconnectDataType = {
  CallSid: string
  Caller: string | undefined
  From: string | undefined
  To: string | undefined
  QueueSid: string
  QueueTime: string
};

type EventdataType = {
  CallSid: string
  Caller: string | undefined
  From: string | undefined
  To: string | undefined
  QueuePosition: number | string
  QueueSid: string
  QueueTime: string
  AvgQueueTime?: string 
  CurrentQueueSize: number | string 
  MaxQueueSize: number | string
}

export interface NotifyAgentDTO extends EventdataType{
  filterCompanyId: string;
  filterQueueId?: string;
}

export interface DisconnectAgentDTO extends DisconnectDataType {
  filterCompanyId: string;
}

export function sendEventToClients(event: NotifyAgentDTO) {
  subscribersService.subscribers.forEach(({ userId, sub }: ISubscriber) => {
    const { companyId, queueIds, agentRole, res } = sub;
    const { filterCompanyId, filterQueueId, ...eventData} = event
    // if (companyId === filterCompanyId) {
    //res.write(`data: ${JSON.stringify(eventData)}\n\n`);  // Send data in SSE format

    // @ts-ignore
    console.log(filterCompanyId);
    const data = {
      agentName: userId,
      company: filterCompanyId,
      queue: filterQueueId,
      data: JSON.stringify(eventData),
    };

    res.write(`data: ${JSON.stringify(data)}\n\n`);
    // }
  });
}

export function sendDisconnectEventToClients(disconect: DisconnectAgentDTO, event: string) {
  subscribersService.subscribers.forEach(({ userId, sub }: ISubscriber) => {
    const { companyId, queueIds, agentRole, res } = sub;
    const { filterCompanyId, ...eventData } = disconect
    // if (companyId === filterCompanyId) {
    //res.write(`data: ${JSON.stringify(eventData)}\n\n`);  // Send data in SSE format

    // @ts-ignore
    console.log(filterCompanyId);
    const data = {
      agentName: userId,
      company: filterCompanyId,
      data: JSON.stringify(eventData),
    };

    res.write(`
      event: ${event}\n\n
      data: ${JSON.stringify(data)}\n\n
    `);
    // }
  });
}