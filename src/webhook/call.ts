import { Response, Request, NextFunction, Router } from "express";


const router = Router(); 

router.post('/', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {
            CallSid,
            ParentCallSid,
            CallStatus,
            CallDuration,
            Timestamp,
            CallbackSource,
            SequenceNumber,
            From, 
            To
        } = req.body;
        
        return res.sendStatus(204);
    } catch (error) {
        return res.sendStatus(500);
    }
});

export default router;