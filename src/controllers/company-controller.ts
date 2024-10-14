import { NextFunction, Response, Request } from "express";
import generateQueue from "../lib/generate-queue";
import { Company } from "../models";

export const listCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await Company.find({});

    return res.status(200).json(clients);
  } catch (error: any) {
    next(error);
  }
};

export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  const { company, phoneInfo, welcomeId, menuIds, messagesIds, queues } = req.body;

  if (!company) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    const companyData = await Company.findOne({
      $elemMatch: { company: company } 
    });

    if (companyData) {
      return res.status(400).send({ message: "Company allready exists" });
    }

    const client =  await Company.create({
      company,
      phoneInfo,
      welcomeId,
      menuIds,
      messagesIds,
      queues
    })

    if (!client) {
      return res.status(400).send({ message: client });
    }

    generateQueue(client.queues, client._id); // gerando as filas de atendimento

    return res.status(201).send({
      _id: client._id,
      company: client.company,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  } catch (error: any) {
    next(error);
  }
};

export const findCompanyByName = async (req: Request, res: Response, next: NextFunction) => {
  const { company } = req.params;

  try {
    const client = await Company.findOne({
      company
    });

    if (client) {
      return res.status(200).send(client);
    }

    return res.status(404).send("Company not found");
  } catch (error: any) {
    next(error);
  }
};

export const findCompanyById = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params;

  try {
    const client = await Company.findOne({
      $elemMatch: { _id } 
    });

    if (client) {
      return res.status(200).json(client);
    }

    return res.status(404).send("Company not found");
  } catch (error: any) {
    next(error);
  }
};

export const updateCompanyQueues = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params;

  try {
    const { company, queues } = req.body;

    if ((!company) || (!queues)) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const client = await  Company.updateOne({ _id, company: company }, { queues: queues });

    if (!client) {
      return res.status(404).send({ message: "Cliente não encontrado" });
    } else {
      return res.status(200).json(client);
    }
  } catch (error: any) {
    next(error);
  }
};

export const updateCompanyPhone = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params;

  try {
    const { company, phoneInfo } = req.body;

    if ((!company) || (!phoneInfo)) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const client = await  Company.updateOne({ _id, company: company }, { phoneInfo: phoneInfo });

    if (!client) {
      return res.status(404).send({ message: "Cliente não encontrado" });
    } else {
      return res.status(200).json(client);
    }
  } catch (error: any) {
    next(error);
  }
};

export const updateCompanyWelcome = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params;

  try {
    const { company, welcomeId } = req.body;

    if ((!company) || (!welcomeId)) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    
    const client = await  Company.updateOne({ _id, company: company }, { welcomeId: welcomeId });

    if (!client) {
      return res.status(404).send({ message: "Cliente não encontrado" });
    } else {
      return res.status(200).json(client);
    }
  } catch (error: any) {
    next(error);
  }
};

export const updateCompanyMenu = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params;

  try {
    const { company, menuIds } = req.body;

    if ((!company) || (!menuIds)) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    
    const client = await  Company.updateOne({ _id, company: company }, { menuIds: menuIds });

    if (!client) {
      return res.status(404).send({ message: "Cliente não encontrado" });
    } else {
      return res.status(200).json(client);
    }
  } catch (error: any) {
    next(error);
  }
};

export const updateCompanyMessages = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params;

  try {
    const { company, messagesIds } = req.body;

    if ((!company) || (!messagesIds)) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    
    const client = await  Company.updateOne({ _id, company: company }, { messagesIds: messagesIds });

    if (!client) {
      return res.status(404).send({ message: "Cliente não encontrado" });
    } else {
      return res.status(200).json(client);
    }
  } catch (error: any) {
    next(error);
  }
};