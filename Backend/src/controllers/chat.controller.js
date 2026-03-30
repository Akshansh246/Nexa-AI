import { generateChatTitle, generateResponse } from "../services/ai.service.js"
import chatModel from '../models/chat.model.js'
import messageModel from '../models/message.model.js'

export async function messageController(req, res) {
    const { message, chat: chatId } = req.body;

    let title = null;
    let chat = null;

    if (!chatId) {
        title = await generateChatTitle(message);

        chat = await chatModel.create({
            user: req.user.id,
            title
        });
    } else {
        // 🔥 FIX: fetch existing chat
        chat = await chatModel.findById(chatId);
    }

    const userMessage = await messageModel.create({
        chat: chat._id,
        content: message,
        role: 'user'
    });

    const messages = await messageModel.find({ chat: chat._id });

    const result = await generateResponse(messages);

    const aiMessage = await messageModel.create({
        chat: chat._id,
        content: result,
        role: 'ai'
    });

    res.status(201).json({
        title,
        chat, // ✅ always valid now
        aiMessage
    });
}

export async function getChatsController(req, res) {
    const user = req.user

    const chats = await chatModel.find({ user: user.id })

    res.status(200).json({
        message:"Chats Fetched Successfully",
        chats
    })
}

export async function getMessagesController(req, res) {
    const {chatId} = req.params

    const chat = await chatModel.findOne({
        _id:chatId,
        user:req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message:"Chat not Found"
        })
    }

    const messages = await messageModel.find({
        chat:chatId
    })

    res.status(200).json({
        message:"Chats fetched successfully",
        messages
    });
}

export async function deleteChatController(req, res) {
    const { chatId } = req.params

    const chat = await chatModel.findOneAndDelete({
        _id:chatId,
        user:req.user.id
    })

    await messageModel.deleteMany({
        chat:chatId
    })

    if (!chat) {
        return res.status(404).json({
            message:"Chat not Found"
        })
    }

    res.status(200).json({
        message:"Chat deleted successfully"
    })

}