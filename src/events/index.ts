import { Response, Request, Router } from "express";
import { QueueSubscriber, Obj } from "../types";

const router = Router(); 

const subscribers: Obj = {};

router.get('/', function (req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const { companyId, queueId, userId } = req.query;

        const subscriber: QueueSubscriber = { companyId, queueId, res };
        //subscribers.push(subscriber);
        subscribers[userId] = subscriber;
    
        req.on('close', () => {
            /*
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }*/
            delete subscribers[userId];
        });
    } catch (error) {
        return res.sendStatus(500);
    }
});

export default router;