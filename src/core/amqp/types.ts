import { NotifyAgentDTO } from "../../lib/events/notify-agent";
import { ENQUEUE_STATUS } from "../../types/constants";

export interface QueueAgentDTO extends NotifyAgentDTO {
  status: ENQUEUE_STATUS
  client: string
  deQueuedTime: string | undefined
  queuedTime: string
}