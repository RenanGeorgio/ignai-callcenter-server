import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Twilio from "../models/twilio";
import mongoose from "../database/index";

export const create = async (req: Request, res: Response, next: NextFunction) => {
    const conn = mongoose.connection;
    const session = await conn.startSession();
    try {
        session.startTransaction();
        const { name, email, cpf, twilio } = req?.body

        if (!name){
            await session.abortTransaction();
            return res.status(400).send({ message: "Bad request! Name required." });
        }

        if (!email) {
            await session.abortTransaction();
            return res.status(400).send({ message: "Bad request! E-mail required." });
        } else {
            const user = await User.findOne({
                email
            }, { session })
            if (user) {
                await session.abortTransaction();
                return res.status(400).send({ message: "Bad request! E-mail already exists." });
            }
        }

        if (!cpf) {
            await session.abortTransaction();
            return res.status(400).send({ message: "Bad request! CPF or CNPJ required." });
        } else {
            const user = await User.findOne({
                cpf
            }, { session })
            if (user) {
                await session.abortTransaction();
                return res.status(400).send({ message: "Bad request! CPF or CNPJ already exists." });
            }
        }

        if (twilio){
            if (Array.isArray(twilio)) {
                if (twilio.length == 0) {
                    await session.abortTransaction();
                    return res.status(400).send({ message: "Bad request! Twilio has no elements." });
                } else {
                    let error = false
                    twilio.map((item) => {
                        if (!item.accountSid) {
                            error = true
                        }
                        if (!item.authToken) {
                            error = true
                        }
                        if (!item.apiKey) {
                            error = true
                        }
                        if (!item.apiSecret) {
                            error = true
                        }
                        if (!item.callerId) {
                            error = true
                        }
                        if (!item.outgoingApplicationSid) {
                            error = true
                        }
                    })
                    if (error){
                        await session.abortTransaction();
                        return res.status(400).send({ message: "Bad request! Some twilio config is missing." });
                    }
                }
            }
            else {
                await session.abortTransaction();
                return res.status(400).send({ message: "Bad request! Twilio must be an array." });
            }
        }

        const newUser = await User.create({
            name,
            email,
            cpf
        }, { session })

        let twilios = []
        if (twilio) {
            if (Array.isArray(twilio)) {
                if (twilio.length > 0) {
                    for (let i = 0; i < twilio.length; i++){
                        twilios.push({
                            userId: newUser,
                            ...twilio[i]
                        });
                    }
                }
            }
            const newTwilio = await Twilio.insertMany(
                twilios,
                { session }
            );
            await User.findByIdAndUpdate(
                newUser,
                {
                    $push: { twilio: newTwilio },
                }, 
                { new: true, session }
            );
        }

        await session.commitTransaction();
        return res.status(201).send({ message: "User created" });
    }
    catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        await session.endSession();
    }
}

export const find = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.query.id) {
            return res.status(400).send({ message: "Bad request!" });
        }

        const user = await User.findById(req.query.id).populate('twilio', '_id callerId accountSid');

        if (!user) {
            return res.status(400).send({ message: "Bad request!" });
        }

        const info = {
            name: user.name,
            email: user.email,
            twilio: user.twilio
        }

        return res.status(200).send(info);
    } catch (error) {
        next(error);
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const conn = mongoose.connection;
    const session = await conn.startSession();
    try {
        session.startTransaction();
        const { id } = req?.params
        const { name, email, cpf, twilio } = req?.body

        if (!id) {
            return res.status(404).send({ message: "User not found!" });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }
        
        if (email) {
            const conflict = await User.findOne({
                email,
                _id: { $ne: id },
            }, { session })
            if (conflict) {
                await session.abortTransaction();
                return res.status(400).send({ message: "Bad request! E-mail already exists." });
            }
        }

        if (cpf) {
            const conflict = await User.findOne({
                cpf,
                _id: { $ne: id },
            }, { session })
            if (conflict) {
                await session.abortTransaction();
                return res.status(400).send({ message: "Bad request! CPF or CNPJ already exists." });
            }
        }

        if (twilio) {
            if (Array.isArray(twilio)) {
                if (twilio.length == 0) {
                    await session.abortTransaction();
                    return res.status(400).send({ message: "Bad request! Twilio has no elements." });
                } else {
                    let error = false
                    twilio.map((item) => {
                        if (!item.accountSid) {
                            error = true
                        }
                        if (!item.authToken) {
                            error = true
                        }
                        if (!item.apiKey) {
                            error = true
                        }
                        if (!item.apiSecret) {
                            error = true
                        }
                        if (!item.callerId) {
                            error = true
                        }
                        if (!item.outgoingApplicationSid) {
                            error = true
                        }
                    })
                    if (error) {
                        await session.abortTransaction();
                        return res.status(400).send({ message: "Bad request! Some twilio config is missing." });
                    }
                }
            }
            else {
                await session.abortTransaction();
                return res.status(400).send({ message: "Bad request! Twilio must be an array." });
            }
        }

        const newUser = await User.findByIdAndUpdate({
            name,
            email,
            cpf
        }, { new: true, session })

        let twilios = []
        if (twilio) {
            if (Array.isArray(twilio)) {
                if (twilio.length > 0) {
                    for (let i = 0; i < twilio.length; i++) {
                        twilios.push({
                            userId: newUser,
                            ...twilio[i]
                        });
                    }
                }
            }
            const newTwilio = await Twilio.insertMany(
                twilios,
                { session }
            );
            await User.findByIdAndUpdate(
                newUser,
                {
                    $push: { twilio: newTwilio },
                },
                { new: true, session }
            );
        }

        await session.commitTransaction();
        return res.status(201).send({ message: "User updated!" });
    }
    catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        await session.endSession();
    }
}


export const del = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req?.params

        if (!id) {
            return res.status(404).send({ message: "User not found!" });
        }

        const user = await User.findByIdAndUpdate(id, { status: "DEACTIVATED" });

        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }

        return res.status(200).send({ message: "User deleted!" });
    }
    catch (error) {
        next(error);
    }
}
