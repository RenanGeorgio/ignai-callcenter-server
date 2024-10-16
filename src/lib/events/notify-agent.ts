import { ISubscriber, subscribersService } from "../../core/subscribers";

export interface NotifyAgentDTO {
  eventData: any
  filterCompanyId: string
  filterQueueId?: string
}

export function sendEventToClients({ eventData, filterCompanyId, filterQueueId }: NotifyAgentDTO) {
  subscribersService.subscribers.forEach(({ userId, sub }: ISubscriber) => {
    const { companyId, queueIds, agentRole, res } = sub;
    
    if (companyId === filterCompanyId) {
      //res.write(`data: ${JSON.stringify(eventData)}\n\n`);  // Send data in SSE format

      // @ts-ignore
      console.log(filterCompanyId);
      res.write(`data: {
        agentName: ${userId},
        company: ${filterCompanyId},
        queue: ${filterQueueId},
        data: ${JSON.stringify(eventData)},
        }\n\n`
      );
    }
  });
}