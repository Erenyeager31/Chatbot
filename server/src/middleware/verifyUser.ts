import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";
import USER from "../models/user";
import { UUID } from "crypto";
import chalk from "chalk";
config();

export const verifyUser = async (req: Request, res: Response, next: any) => {
  try {
    if (!req.headers?.cookie) {
      console.log(chalk.red("error 1"),chalk.white(req.headers));
      return res.status(200).json({
        success: false,
        message: "Please login!",
      });
    }

    console.log(chalk.blue(req?.headers?.cookie));

    const token = req?.headers?.cookie?.split("=")[1];

    console.log(chalk.blue(token));
    console.log(chalk.red("error"));

    const verification = jwt.verify(token, process.env.JWT_SECRET as string);

    const userID = (verification as JwtPayload).userID;

    const user = await USER.findOne({ where: { id: userID } });

    if (verification && user) {
      // @ts-ignore
      req.id = verification;
      next();
    } else {
      console.log(chalk.red("error"));
      return res.status(200).json({
        success: false,
        message: "Please login!",
      });
    }
  } catch (error) {
    console.log(chalk.red(error));
    return res.status(200).json({
      success: false,
      message: "Please login!",
    });
  }
};
