import { NextFunction, Request, Response } from "express";
import { listenerQueue } from "../../core/http";
import { sendEventToClients, NotifyAgentDTO, sendDisconnectEventToClients, DisconnectAgentDTO } from "../../lib/events/notify-agent";
import { failedConnection, aboutToConnect, waitMusic, enqueueFailed, finishCall } from "../../lib/documents";
import config from "../../config/env";
import { ENQUEUE_STATUS, CALL_STATUS, QUEUE_RESULT_STATUS } from "../../types/constants";
import { QueueAgentDTO } from "../../core/amqp/types";
import { removeUserQueue } from "../../helpers/queue";

export const toConnect = (request: Request, response: Response, next: NextFunction) => {
  // @ts-ignore
  console.log("to connect");
  const { companyId } = request.query;

  if (!companyId) {
    return response.status(400).send({ message: "Missing required fields" });
  }

  try {
    const connectCurrentCall = async (company: string, id: string) => {
      const found: QueueAgentDTO | null = await listenerQueue.findCall(company, id); 
      if (found) {
        const removed = await removeUserQueue(found.filterQueueId as string, found?.client);

        return removed;
      }
    };

    const { 
      CallStatus, 
      ForwardedFrom, 
      ParentCallSid, 
      Caller, 
      From, 
      To, 
      QueueSid, 
      CallSid, 
      QueueTime, 
      DequeingCallSid 
    } = request.body;

    const value = { 
      CallStatus, 
      ForwardedFrom, 
      ParentCallSid, 
      Caller, 
      From, 
      To, 
      QueueSid, 
      CallSid, 
      QueueTime, 
      DequeingCallSid 
    }

    connectCurrentCall(companyId, CallSid);
    
    // @ts-ignore
    console.log(value);

    return response.send(aboutToConnect());
  }
  catch (error) {
    next(error);
  }
};

export const toWaitRoom = (request: Request, response: Response, next: NextFunction) => {
  // @ts-ignore
  console.log("to wait room");
  try {
    const enquedeCall = async (data: NotifyAgentDTO, client: string) => {
      const newData: QueueAgentDTO = {
        ...data,
        client,
        status: ENQUEUE_STATUS.QUEUED,
        deQueuedTime: undefined,
        queuedTime: new Date().toString()
      }

      const result = await fetch(`${config.amqp.host}/send-msg`, {
        method: 'POST',
        body: JSON.stringify(newData)
      });

      return result;
    };

    const { queue, company, client } = request.query;
    // @ts-ignore
    console.log(request.query);

    const { 
      CallSid,
      Caller, 
      From, 
      To,
      CallStatus,
      QueuePosition, 
      QueueSid, 
      QueueTime, 
      AvgQueueTime, 
      CurrentQueueSize, 
      MaxQueueSize 
    } = request.body;

    if ((CallStatus === CALL_STATUS.FAILED) || (CallStatus === CALL_STATUS.CANCELED)) {
      return response.send(enqueueFailed());
    }

    const eventdata = {
      CallSid,
      Caller, 
      From, 
      To,
      QueuePosition, 
      QueueSid, 
      QueueTime, 
      AvgQueueTime, 
      CurrentQueueSize, 
      MaxQueueSize 
    }

    const notifydata: NotifyAgentDTO = {
      eventData: eventdata,
      filterCompanyId: company,
      filterQueueId: queue ? queue : undefined
    }

    // @ts-ignore
    console.log(notifydata);

    enquedeCall(notifydata, client);

    sendEventToClients(notifydata);

    return response.send(waitMusic());
  }
  catch (error) {
    next(error);
  }
};

export const toActionTake = (request: Request, response: Response, next: NextFunction) => {
  // @ts-ignore
  console.log("toActionTake");

  const { company, queue, client } = request.query;
  try {
    const { 
      CallSid,
      Caller, 
      From, 
      To,
      QueueResult,
      QueueSid,
      QueueTime
    } = request.body;

    const eventdata = { 
      CallSid,
      Caller, 
      From, 
      To,
      QueueSid,
      QueueTime
    }

    const notifydata: DisconnectAgentDTO = {
      eventData: eventdata,
      filterCompanyId: company,
    }

    if (QueueResult === QUEUE_RESULT_STATUS.HANGUP) {
      sendDisconnectEventToClients(notifydata, QueueResult);

      return response.send();
    } else if ((QueueResult === QUEUE_RESULT_STATUS.ERROR) || (QueueResult === QUEUE_RESULT_STATUS.SYSTEM_ERROR)) {
      sendDisconnectEventToClients(notifydata, "queueerror");

      return response.send(failedConnection());
    } else {
      // @ts-ignore
      console.log(value);
      return response.send(finishCall(QueueSid));
    }
  }
  catch (error) {
    next(error);
  }
};