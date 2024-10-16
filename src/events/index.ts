import { Response, Request, Router } from "express";
import { subscribersService, ISubscriber } from "../core/subscribers";
import { QueueSubscriber } from "../types";

const router = Router(); 

router.get('/', function (req: Request, res: Response) {
    // @ts-ignore
    console.log("event");
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    //const { companyId, queueId, userId } = req.query;
    const { userId, company } = req.query;
    // @ts-ignore
    console.log(userId);

    if (!userId) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    try {
        const subscriber: QueueSubscriber = { 
            companyId: company, 
            res 
        };
        
        //subscribers.push(subscriber);
        const data: ISubscriber = {
            sub: subscriber,
            userId: userId,
        }

        // @ts-ignore
        console.log(data);

        subscribersService.sentData(data);
        //subscribers[userId] = subscriber;
    
        req.on('close', () => {
            /*
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }*/
            subscribersService.unSubscriber(userId);
        });
    } catch (error) {
        return res.sendStatus(500);
    }
});

export default router;