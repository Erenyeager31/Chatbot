import express, { Express, Request, Response } from "express";
import { config } from "dotenv";
config();
import sequelizeConnection from "./dbconfig";
// import USER from "./models/user";
// import CONVERSATION from "./models/conversation";
// import CHAT from "./models/chat";
// import Token from "./models/token";
import AuthRouter from "./routes/AuthRoutes";
import ChatRouter from "./routes/ChatRoutes";
import chalk from "chalk";
import cors from "cors";
import { verifyUser } from "./middleware/verifyUser";
import { getUserDetails } from "./controller/fetchUserData";
import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import url from "url";
import { UUID } from "crypto";
import { verifyUserforSocket } from "./services/verifyUserForSocket";
import { newChat, newMessage } from "./controller/ChatController";

interface receivedMessage {
  messageType: string;
  message: string;
  conversation_id?: UUID;
}

const app: Express = express();

//? WebSocket configuration
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });

app.use(express.json());
app.use(
  cors({
    // origin: process.env.FRONT_URL,
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const port = process.env.PORT || 3000;
console.log(process.env.PORT);

// Connecting to the database
const syncDatabase = async () => {
  try {
    await sequelizeConnection.sync({ force: false, logging: false }); // Synchronize all models
    // await USER.sync({ force: false });
    // await CONVERSATION.sync({ force: false });
    // await CHAT.sync({ force: false });
    // await Token.sync({ force: false });

    console.log(chalk.magenta("Database Connected!"));
  } catch (error) {
    console.log("Some error occurred:", error);
  }
};

//? WebSocket code
wsServer.on("connection", (ws, req: http.IncomingMessage) => {
  const userID = url.parse(req.url!, true).query.userID;
  console.log(chalk.bgBlue('New connection:',userID));

  const verificationStatus = verifyUserforSocket(userID as UUID);

  if (!verificationStatus) {
    ws.send(
      JSON.stringify({
        messageType:'SF',
        status: false,
        message: "Invalid connection, closing socket !",
      })
    );
    wsServer.close();
  } else {
    ws.send(
      JSON.stringify({
        messageType:'SS',
        status: true,
        message: "connected to the socket succesfully",
      })
    );
  }

  ws.on("message", async (data: Buffer) => {
    const receivedData = data.toString();
    const receivedDataJSON: receivedMessage = JSON.parse(receivedData);

    console.log("Received message:", receivedData);
    // destructuring received message
    const { messageType, message, conversation_id } =
      receivedDataJSON as receivedMessage;
    console.log(messageType, message, conversation_id);

    if (messageType === "newChat") {
      const response = await newChat(message, userID as UUID);
      console.log(chalk.magenta(response));
      ws.send(JSON.stringify(response));

    } else if (messageType === "newMessage") {
      const response = await newMessage(
        message,
        conversation_id as UUID,
        userID as UUID
      );

      console.log(chalk.magenta(response));

      ws.send(JSON.stringify(response));
    }
  });

  ws.on("close", () => {
    console.log("Connection closed");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

app.use("/auth", AuthRouter);
app.use("/chat", ChatRouter);
app.use("/getUserDetails", verifyUser, getUserDetails);

syncDatabase();

server.listen(port, () => {
  console.log(chalk.greenBright(`Server on: http://localhost:${port}`));
});
