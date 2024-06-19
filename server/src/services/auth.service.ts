import bcrypt from "bcrypt";
import User from "../models/user";
import crypto from "crypto";
import Token from "../models/token";
import { config } from "dotenv";
config();

export const forgotPasswordService = async (email: string) => {
  //? check if the username exists or not within the database
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return {
      status: false,
      message: "User does not exist",
      username: null,
      link: null,
    };
  }

  //? if the user is valid, generate a token for resetting the password using crypto
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(resetToken, 10);

  const tokenData = {
    userID: user.id,
    token: hashedToken,
  };

  //? creation of a new row in the db for password reset
  const token = await Token.create(tokenData);

  //? creating link for password reset
  const link =
    `${process.env.FRONT_URL}/passwordReset?token=${resetToken}&id=${user.id}` as string;

  const username = user.username;

  return {
    status: true,
    message: "User does not exist",
    username: username,
    link: link,
  };
};

export const resetPassword = async () => {};
