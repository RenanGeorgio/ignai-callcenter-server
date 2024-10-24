import { Response, Request, NextFunction, Router } from "express";
// import { messageHandler as wbMessageHandler } from "../controllers/com/whatsapp/webhook";

const router = Router(); 

router.get('/', function (req: Request, res: Response, next: NextFunction) {
    let verificationToken;

    try {
        if (process.env.WEBHOOK_VERIFICATION_TOKEN) {
            verificationToken = process.env.WEBHOOK_VERIFICATION_TOKEN ? process.env.WEBHOOK_VERIFICATION_TOKEN.replace(/[\\"]/g, '') : "invalid";
        } else {
            verificationToken = null;
        }
        
        if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == verificationToken) {
            return res.status(200).send(req.query['hub.challenge']);
        } else {
            return res.sendStatus(400);
        }
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.post('/', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const data = req?.body;
        
        if ((data.object != undefined) || (data.entry != undefined)) {
            // await wbMessageHandler(req);
            return res.sendStatus(200);
        } else {
            return res.sendStatus(400);
        }
    } catch (error) {
        return res.sendStatus(500);
    }
});

export default router;