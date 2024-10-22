import { NotifyAgentDTO } from "../../lib/events/notify-agent";
import { ENQUEUE_STATUS } from "../../assets/constants";

export interface QueueAgentDTO extends NotifyAgentDTO {
  status: ENQUEUE_STATUS
  deQueuedTime: string | undefined
  queuedTime: string
}