import { SchemaFieldTypes } from "redis";

export const data = {
  eventData: {
    CallSid: {
      type: SchemaFieldTypes.TEXT,
      SORTABLE: true
    },
    Caller: SchemaFieldTypes.TEXT,
    From: SchemaFieldTypes.TEXT,
    To: SchemaFieldTypes.TEXT,
    QueuePosition: SchemaFieldTypes.NUMERIC,
    QueueSid: SchemaFieldTypes.TEXT,
    QueueTime: SchemaFieldTypes.TEXT,
    AvgQueueTime: SchemaFieldTypes.TEXT,
    CurrentQueueSize: SchemaFieldTypes.NUMERIC, 
    MaxQueueSize: SchemaFieldTypes.NUMERIC,
    status: SchemaFieldTypes.TAG,
    deQueuedTime: SchemaFieldTypes.TEXT,
    queuedTime: SchemaFieldTypes.TEXT
  },
  filterCompanyId: SchemaFieldTypes.TEXT,
  filterQueueId: SchemaFieldTypes.TEXT
}