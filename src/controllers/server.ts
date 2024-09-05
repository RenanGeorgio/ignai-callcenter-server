import { AuthApi } from "../services";
import mongoose from "../database";

export default {
    async status(req, res, next) {
        try{
            const result = await mongoose.connection.readyState;
            if (result === 1){

                const testeServer = await AuthApi('/test-server', {
                    method: 'GET',
                })


                return res.status(200).send({ message: "Server is running !" }, testeServer);
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