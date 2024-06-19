import { config } from "dotenv";
import jwt from "jsonwebtoken";
config();

export const generateSessionID = async (id: string) => {
  const sessionID = await jwt.sign({userID:id}, process.env.JWT_SECRET as string,{expiresIn:'1h'});
  return sessionID
};
