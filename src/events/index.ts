import { Response, Request, Router } from "express";
import { subscribersService as subscribers, ISubscriber } from "../core/subscribers";
import { QueueSubscriber } from "../types";
import { Agent } from "../models";

const router = Router(); 

router.get('/', async function (req: Request, res: Response) {
    // @ts-ignore
    console.log("event");
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    //const { companyId, queueId, userId } = req.query;
    const userId = req.query.userId as string;
    // @ts-ignore
    console.log(userId);

    if (!userId) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    try {
        // const agentData = await Agent.findOne({
        //     _id: userId
        // });

        //if (!agentData) {
        //    return res.status(400).send({ message: "Agent data Missing!" });
        //}
        const agentData = {
            company: "company",
            allowedQueues: ["default"],
            role: "role"
        }

        const { company, allowedQueues, role } = agentData;

        const subscriber: QueueSubscriber = { 
            companyId: company, 
            queueIds: allowedQueues, 
            agentRole: role,
            res 
        };
        
        //subscribers.push(subscriber);
        const data: ISubscriber = {
            sub: subscriber,
            userId: userId,
        }

        // @ts-ignore
        console.log(data);

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