import { Router } from 'express'
import { IdentifyUser } from '../middlewares/auth.middleware.js'
import { deleteChatController, getChatsController, getMessagesController, messageController } from '../controllers/chat.controller.js'

const chatRouter = Router()

/**
 * @route /api/chats/message
 * @description Sends the message of user to ASP
 * @access private
 */
chatRouter.post('/message', IdentifyUser, messageController)

/**
 * @route /api/chats/
 * @description returns the chats of a user
 * @access private
 */
chatRouter.get('/',IdentifyUser, getChatsController)

/**
 * @route /api/chats/:chatId/messages
 * @description returns the messages of a chat using chatId
 * @access private
 */
chatRouter.get('/:chatId/messages', IdentifyUser, getMessagesController)

/**
 * @route /api/chats/delete/:chatId
 * @description deletes the chat
 * @access private
 */
chatRouter.delete('/delete/:chatId', IdentifyUser, deleteChatController)

export default chatRouter