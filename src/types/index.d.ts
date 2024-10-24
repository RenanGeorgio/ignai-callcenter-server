import { Response } from "express";
import { WebsocketUser } from "./types";

export type Obj = {
    [key: string]: any
}

export type QueueSubscriber = {
    companyId: string
    queueIds?: string[]
    agentRole?: string
    res: Response
}

export {
    WebsocketUser,
}