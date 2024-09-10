import { AuthApi } from "../services";
// import mongoose from "../database";
import { Request, Response, NextFunction } from "express";

export default {
    async status(req: Request, res: Response, next: NextFunction) {
        try{
            // const result = mongoose.connection.readyState;
            // if (result === 1){

                const testeServer = await AuthApi('/test-server', {
                    method: 'GET',
                })


                return res.status(200).send({ message: "Server is running !", testeServer });
            // }
            // else{
            //     return res.status(500).send({ message: "Database is not running !" });
            // }
        }
        catch(error){
            next(error);
        }
    }
}