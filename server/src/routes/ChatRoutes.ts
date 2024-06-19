import express from "express"
const ChatRouter = express.Router()
import {body} from "express-validator"
import { verifyUser } from "../middleware/verifyUser"
import { getChats, getConversation, newChat, newMessage } from "../controller/ChatController"

// ChatRouter.post(
//     "/newchat",
//     verifyUser,
//     [
//         body('message','Please send a message').exists()
//     ],
//     newChat
// )

// ChatRouter.post(
//     "/newMessage",
//     verifyUser,
//     newMessage
// )

ChatRouter.get(
    "/getConversations",
    verifyUser,
    getConversation
)

ChatRouter.post(
    "/getChats",
    verifyUser,
    getChats
)

export default ChatRouter