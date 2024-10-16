import { subscribersService as subscribers } from "../../core/subscribers";

export interface NotifyAgentDTO {
  eventData: any
  filterCompanyId: string
  filterQueueId?: string
}

export function sendEventToClients({ eventData, filterCompanyId, filterQueueId }: NotifyAgentDTO) {
  // @ts-ignore
  Object.entries(subscribers).forEach(([key, { companyId, queueIds, res }]) => {
    // @ts-ignore
    console.log(queueIds);
    /*if (filterQueueId) {
      if ((companyId === filterCompanyId) && (queueId === filterQueueId)) {
        // @ts-ignore
        console.log(filterCompanyId);
        res.write(`data: ${JSON.stringify(eventData)}\n\n`);
      }
    } else {*/
    
    // TESTE
    // @ts-ignore
    console.log(filterCompanyId);
    res.write(`data: {
      agentName: ${key},
      company: ${filterCompanyId},
      queue: ${filterQueueId},
      data: ${JSON.stringify(eventData)},
      }\n\n`
    );/*
    if (companyId === filterCompanyId) {
      // @ts-ignore
      console.log(filterCompanyId);
      res.write(`data: {
        agentName: ${key},
        company: ${filterCompanyId},
        queue: ${filterQueueId},
        data: ${JSON.stringify(eventData)},
        }\n\n`
      );
    }*/
   // }
  });
}