import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken';
import { secret } from '../config/auth.json';

declare var process : {
    env: {
      secret: string
    }
  }

async function checkToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers['authorization']?.split(' ')[1];


        if (!token) {
          return res.status(401).send({ message: "No token provided" });
        }

        jwt.verify(token, secret, (error: Error | null, decoded: any) => {
          if (error) {
            if(error.message === 'jwt expired') {
              return res.status(401).send({ message: 'Token expired' });
            }
            return res.status(401).send({ message: 'Invalid token' });
          } else {
            const { companyId } = req.params;
            req.params.companyId = companyId ? companyId : decoded.companyId;
            req.params.userId = decoded.id;
            next();
          }
        });

    } catch (error) {
        console.error(error)
        next(error);
    }
  }

export default checkToken;