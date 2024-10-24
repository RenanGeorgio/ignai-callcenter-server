import { Request, Response, NextFunction } from "express";
import { addUserQueue, listUsersQueue, removeUserQueue } from "../helpers/queue";

// FUNÇÕES DE TESTE PARA FILA EM ESPERA NO REDIS - Apagar quando não precisar
export const adicionar = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const company = 'unimarka'

        const user = await addUserQueue(company);

        return res.status(200).send({ user });
    }
    catch(error){
        next(error);
    }
}

export const remover = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const removed = await removeUserQueue('unimarka:waitroom:1', 'user:6')
        if (removed){
            return res.status(200).send({ message: "removido" });
        }else{
            return res.status(200).send({ message: "não removido" });
        }
    }
    catch (error) {
        next(error);
    }
}

export const pegar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const company = 'unimarka'

        const queues = await listUsersQueue(company);

        return res.status(200).send({ queues });
    }
    catch (error) {
        next(error);
    }
}