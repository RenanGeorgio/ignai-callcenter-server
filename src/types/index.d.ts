import { Response } from "express";
import { WebsocketUser } from "./types";

export type Obj = {
    [key: string]: any
}

export type QueueSubscriber = {
    companyId: string
    queueId?: string | undefined
    res: Response
}

export {
    WebsocketUser
}