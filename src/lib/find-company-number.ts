import { Response } from "express";
import { waitMusic } from "./documents";
import { Company } from "../models";
import { Obj } from "../types";


function queyPhoneNumber(phoneNumber: string) {
  return Company.findOne({ "phoneInfo.phoneNumber": phoneNumber });
}

export default function handleFindCompanyNumber(phoneNumber: string, res: Response): Obj | undefined {
  const musicResponse = waitMusic();
  res.type('text/xml');
  res.send(musicResponse);

  try {
    queyPhoneNumber(phoneNumber)
      .then((company: Obj) => {
        if (company) {
          return company;
        } else {
          return undefined;
        }
      })
      .catch((error: any) => {
        console.error("Error finding company:", error);
        return undefined;
      });
  } catch (error: any) {
    console.error("Error finding company:", error);
    return undefined;
  }
}
