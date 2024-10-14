import { subscribersService as subscribers } from "../../core/subscribers";

export interface NotifyAgentDTO {
  eventData: any
  filterCompanyId: string
  filterQueueId?: string
}

export function sendEventToClients({ eventData, filterCompanyId, filterQueueId }: NotifyAgentDTO) {
  // @ts-ignore
  Object.entries(subscribers).forEach(([key, { companyId, queueId, res }]) => {
    if (filterQueueId) {
      if ((companyId === filterCompanyId) && (queueId === filterQueueId)) {
        res.write(`data: ${JSON.stringify(eventData)}\n\n`);
      }
    } else {
      if (companyId === filterCompanyId) {
        res.write(`data: ${JSON.stringify(eventData)}\n\n`);
      }
    }
  });
}