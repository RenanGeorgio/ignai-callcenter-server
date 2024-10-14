import { Response, Request, Router } from "express";
import { subscribersService as subscribers, ISubscriber } from "../core/subscribers";
import { QueueSubscriber } from "../types";

const router = Router(); 

router.get('/', function (req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const { companyId, queueId, userId } = req.query;

        const subscriber: QueueSubscriber = { companyId, queueId, res };
        //subscribers.push(subscriber);
        const data: ISubscriber = {
            sub: subscriber,
            userId: userId,
        }

        subscribers.sentData(data);
        //subscribers[userId] = subscriber;
    
        req.on('close', () => {
            /*
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }*/
            subscribers.unSubscriber(userId);
        });
    } catch (error) {
        return res.sendStatus(500);
    }
});

export default router;