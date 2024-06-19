import { config } from "dotenv";
import jwt from "jsonwebtoken";
config();

export const generateConversationID = async (id: string) => {
  const conversationID = await jwt.sign({userID:id}, process.env.JWT_SECRET as string,{expiresIn:'1h'});
  return conversationID
};
