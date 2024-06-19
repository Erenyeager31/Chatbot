import { Request, Response } from "express";
import { generateConversationID } from "../utils/generateConversationID";
import CONVERSATION from "../models/conversation";
import CHAT from "../models/chat";
import { generateResponse } from "../services/Chat Services/Chat.service";
import { UUID } from "crypto";
import chalk from "chalk";

const bot = "00000000-0000-0000-0000-000000000000";

interface customRequest extends Request {
  id?: {
    userID: string;
  };
}

interface responseType {
  generated_text?: string;
}

export const newChat = async (message: string, userID: UUID) => {
  try {
    // const { message } = req.body;

    // @ts-ignore
    // const token = req.id;

    // console.log(token);
    // const conversation_id = await generateConversationID(token);

    console.log(message, userID);

    const conversation_data = {
      user_id: userID,
      topic: message,
    };

    const conversation = await CONVERSATION.create(conversation_data);

    console.log(conversation);

    const chatData1 = {
      conversation_id: conversation.id,
      sender: userID,
      receiver: bot,
      message,
    };

    console.log(chalk.redBright("1"));

    try {
      const chat1 = await CHAT.create(chatData1);
    } catch (error) {
      console.log(chalk.redBright(error));
    }

    console.log(chalk.redBright("2"));

    const { status, response } = await generateResponse(message);

    let response2 = (response as responseType)?.generated_text
      ?.split("\n")
      .reduce((acc: string, curr: string, index: number) => {
        if (index > 0) acc += curr;
        return acc;
      }, "");

    if (response2 === "") {
      response2 = (response as responseType)?.generated_text;
    }

    console.log(chalk.redBright("3"));
    console.log(response2);

    const chatData2 = {
      conversation_id: conversation.id,
      sender: bot,
      receiver: userID,
      //@ts-ignore
      message: response2 as string,
    };

    const chat2 = await CHAT.create(chatData2);

    // return res.status(200).json(response);
    return {
      messageType: "NCS",
      conversation_id: conversation.id,
      response2,
    };
  } catch (error) {
    console.log(chalk.redBright(error));
    return {
      messageType: "NCF",
      conversation_id: null,
      response2: "failure",
    };
  }
};

export const newMessage = async (
  message: string,
  conversation_id: UUID,
  userID: UUID
) => {
  try {
    // const userID = req?.id?.userID;

    // const { conversation_id, message } = req?.body;

    console.log(chalk.magentaBright("USERID --> ", userID));

    const userSenderChatData = {
      conversation_id,
      sender: userID as UUID,
      receiver: bot as UUID,
      message,
    };

    console.log(
      chalk.green("Data for sequel --> ", JSON.stringify(userSenderChatData))
    );

    try {
      const chat1 = await CHAT.create(userSenderChatData);
    } catch (error) {
      throw `here --> ${error}`;
    }

    // generate response from the model
    const { status, response } = await generateResponse(message);

    let response2 = await (response as responseType)?.generated_text
      ?.split("\n")
      .reduce((acc: string, curr: string, index: number) => {
        if (index > 0) acc += curr;
        return acc;
      }, "");

    if (response2 === "") {
      response2 = (response as responseType)?.generated_text;
    }

    console.log("Generate response :", response2, response);

    const userReceiverChatData = {
      conversation_id,
      sender: bot as UUID,
      receiver: userID as UUID,
      message: response2 as string,
    };

    const chat2 = await CHAT.create(userReceiverChatData);

    console.log(chalk.green("debug"));

    return {
      messageType: "NMS",
      status,
      message: response2,
    };
  } catch (error) {
    // return res.status(200).json({
    //   status: false,
    //   message: "Unable to generate response, please try again !",
    // });
    console.log(chalk.red("Model Error:", error));
    return {
      messageType: "NMF",
      status: false,
      message: "Unable to generate response, please try again !",
    };
  }
};

export const getConversation = async (req: customRequest, res: Response) => {
  try {
    const userID = req?.id?.userID;

    const conversations = await CONVERSATION.findAll({
      where: { user_id: userID },
    });

    return res.status(200).json({
      status: true,
      message: "Conversation fetched Succesfully",
      data: conversations,
    });
  } catch (error) {
    return res.status(200).json({
      status: false,
      message: "Some error occured !",
      data: [],
    });
  }
};

export const getChats = async (req: customRequest, res: Response) => {
  try {
    const userID = req?.id?.userID;

    console.log(chalk.green("debug"));

    const { conversation_id } = req.body;

    const conversation = await CONVERSATION.findOne({
      where: { id: conversation_id, user_id: userID },
    });

    if (conversation) {
      const chats = await CHAT.findAll({ where: { conversation_id } });
      return res.status(200).json({
        status: true,
        message: "Chats fetched succesfully",
        data: chats,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Chats not found !",
        data: [],
      });
    }
  } catch (error) {
    return res.status(200).json({
      status: false,
      message: "Some error occured !",
      data: [],
    });
  }
};
