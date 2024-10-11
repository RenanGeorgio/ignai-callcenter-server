import { QueueSubscriber } from "../../types";

export default function sendEventToClients(eventData: any, filterCompanyId: string, filterQueueId?: string) {
  subscribers.forEach(({ companyId, queueId, res }: QueueSubscriber) => {
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