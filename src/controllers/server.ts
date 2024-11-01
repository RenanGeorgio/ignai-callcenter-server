import mongoose from "../database";
import { Request, Response, NextFunction } from "express";

export default {
    async status(req: Request, res: Response, next: NextFunction) {
        try{
            const result = mongoose.connection.readyState;
            if (result === 1){
                return res.status(200).send({ message: "Server is running !" });
            }
            else{
                return res.status(500).send({ message: "Database is not running !" });
            }
        }
        catch(error){
            next(error);
        }
    }
}