import Token from "../models/token";
import bcrypt from "bcrypt";
import User from "../models/user";
import { saltRoundGen } from "../utils/saltRoundGenerator";

export const resetPasswordService = async (
  userID: string,
  token: string,
  password: string
) => {
  try {
    const tokenData = await Token.findOne({ where: { userID } });

    if (!tokenData) {
      return {
        username: null,
        email: null,
        status: false,
        message: "Invalid Request, please try again",
      };
    }

    // checking if the token is still valid based on the time it was created
    //if invalid then delete the token and inform the user to again try forgot password

    //@ts-ignore
    const createdAt = new Date(tokenData?.createdAt);
    const deadlineDate = new Date(createdAt.getTime() + 1 * 60 * 60 * 1000);
    const currentTime = new Date();

    const isExpired = deadlineDate < currentTime;

    if (isExpired) {
      return {
        username: null,
        email: null,
        status: false,
        message: "Password reset link has expired !",
      };
    }

    const tokenStatus = await bcrypt.compare(token, tokenData?.token as string);

    if (!tokenStatus) {
      return {
        username: null,
        email: null,
        status: false,
        message: "Invalid reset password link, please try again",
      };
    }

    // all the checks are done, process to save a new password
    const user = await User.findOne({ where: { id: userID } });

    // perform password hashing
    //? hashing the password using bcryptjs
    //@ts-ignore
    const saltRounds = saltRoundGen(user?.username);

    //? salt generated
    const salt = await bcrypt.genSalt(saltRounds);

    //? hashed password
    const hashedPassword = await bcrypt.hash(password, salt);

    user?.update({
      password: hashedPassword,
    });
    user?.save();

    tokenData.destroy();

    return {
      username: user?.username,
      email: user?.email,
      status: true,
      message: "Password reset succesfull !",
    };
  } catch (error) {
    return {
      username: null,
      email: null,
      status: false,
      message: "Password reset link has expired !",
    };
  }
};
