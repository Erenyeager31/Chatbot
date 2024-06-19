import { Express, Request, Response, response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { saltRoundGen } from "../utils/saltRoundGenerator";
import USER from "../models/user";
import { generateSessionID } from "../utils/generateSessionID";
import { formatTo12Hour } from "../utils/formatDate";
import crypto from "crypto";
import { forgotPasswordService } from "../services/auth.service";
import { sendEmail } from "../services/emailDispatchPasswordRequest";
import { resetPasswordService } from "../services/reset.password.service";
import { sendEmailGenericTemplate } from "../services/emailDispatchGeneric";
import chalk from "chalk";

// demo --> Dishant , dishant31 / 1234567890 / dishantrocks
// demo --> testUser , tesstpassword

interface customRequest extends Request {
  id?: {
    userID: string;
  };
}

export const getUserDetails = async (req: customRequest, res: Response) => {
  try {
    const userID = req?.id?.userID;

    const user = await USER.findOne({where:{id:userID}})

    if(!user){
        return res.status(200).json({
            status:false,
            data:[]
        })
    }else{
        return res.status(200).json({
            status:true,
            data:user
        })
    }
  } catch (error) {
    return res.status(200).json({
      status: false,
      message: "Some error occured !",
      data: [],
    });
  }
};
