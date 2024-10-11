import { Response, Request, Router } from "express";

const router = Router(); 

router.get('/', function (req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const { companyId, queueId } = req.query;

        const subscriber = { companyId, queueId, res };
        subscribers.push(subscriber);
    
        req.on('close', () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
        });
    } catch (error) {
        return res.sendStatus(500);
    }
});

export default router;