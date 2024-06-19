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

// demo --> Dishant , dishant31 / 1234567890 / dishantrocks
// demo --> testUser , tesstpassword

interface emailData {
  username: string;
  link: string;
  email: string;
}

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array(),
    });
  }

  // valid
  const { email, password } = req.body;

  // console.log(email);
  const user = await USER.findOne({ where: { email } });
  // console.log(user);
  if (!user) {
    return res.status(409).json({
      status: false,
      message: "Please use a valid Username",
    });
  }

  const grantAccess = await bcrypt.compare(password, user.password);

  if (!grantAccess) {
    return res.status(400).json({
      status: false,
      message: "Invalid Credentials !",
    });
  }

  // generation of the sessionID
  const sessionID = await generateSessionID(user.id);

  return res
    .status(200)
    .cookie("sessionID", sessionID, {
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 hour expiration
      httpOnly: true,
      sameSite: "none", // Required for cross-origin cookies
      secure: true,
    })
    .json({
      status: true,
      message: "Login Successful",
    });
};

export const signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  console.log(req.body);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array(),
    });
  }

  // valid
  const { username, email, password } = req.body;

  //1. Check if the email already exists
  const user = await USER.findOne({ where: { email } });

  if (user) {
    return res.status(409).json({
      status: false,
      message: "Please use a valid Email Address",
    });
  }

  //? hashing the password using bcryptjs
  const saltRounds = saltRoundGen(username);

  //? salt generated
  const salt = await bcrypt.genSalt(saltRounds);

  //? hashed password
  const hashedPassword = await bcrypt.hash(password, salt);

  const userData = {
    username: username,
    email: email,
    password: hashedPassword,
  };

  const userResponse = await USER.create(userData);

  if (userResponse) {
    return res.status(200).json({
      status: true,
      message: "User created succesfully ✅",
    });
  }
};

//password reset request

export const passwordResetRequestController = async (
  req: Request,
  res: Response
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array(),
    });
  }

  const { email } = req.body;

  const dataRes = await forgotPasswordService(email);

  if (!dataRes?.status) {
    //* user does not exist
    return res.status(300).json({
      status: false,
      message: dataRes?.message,
    });
  }

  //user exists
  const { status, message, username, link } = await dataRes;

  //? service to send email
  //@ts-ignore
  const { status: emailStatus, message: emailMessage } = await sendEmail(
    email,
    //@ts-ignore
    link,
    username
  );

  if (!status) {
    return res.status(200).json({
      status: emailStatus,
      message: emailMessage,
    });
  }
  return res.status(200).json({
    status: emailStatus,
    message: emailMessage,
  });
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array(),
    });
  }

  try {
    const { userID, token, password } = req.body;

    const { username, email, status, message } = await resetPasswordService(
      userID,
      token,
      password
    );

    if (!status) {
      return res.json({
        status,
        message,
      });
    } else {
      // dispatch an email then sent a response

      const { status: emailStatus, message: emailMessage } =
        await sendEmailGenericTemplate(
          //@ts-ignore
          email,
          username,
          "Password Reset Succesful",
          "Your password has been reset succesfully based on your previous request, you may proceed to login your account"
        );

      return res.json({
        status,
        message,
      });
    }
  } catch (error) {}
};
