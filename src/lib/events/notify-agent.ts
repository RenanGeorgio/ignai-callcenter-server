export default function sendEventToClients(eventData: any, filterCompanyId: string, filterQueueId?: string) {
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