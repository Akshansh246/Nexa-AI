import { addMessages, addNewMessage, createNewChat, setChats, setCurrentChatId, setLoading, replaceThinkingMessage, moveMessages } from "../chat.slice"
import { getChats, getMessages, sendMessage } from "../services/chat.api"
import { initializeSocketConnection } from "../services/chat.socket"
import { useDispatch } from 'react-redux'

export const useChat = () => {
    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }) {

        // 🔥 1. create temp id
        const tempChatId = chatId || "temp-" + Date.now();

        // 🔥 2. create temp chat if new
        if (!chatId) {
            dispatch(createNewChat({
                chatId: tempChatId,
                title: "New Chat"
            }))
        }

        // 🔥 3. add user + thinking messages
        dispatch(addNewMessage({
            chatId: tempChatId,
            content: message,
            role: "user"
        }))

        dispatch(addNewMessage({
            chatId: tempChatId,
            content: "Thinking...",
            role: "ai",
            isThinking: true
        }))

        dispatch(setLoading(true))

        try {
            const data = await sendMessage({ message, chatId })
            const { chat, aiMessage } = data

            const realChatId = chat._id

            if (!chatId) {
                // 🔥 4. create real chat
                dispatch(createNewChat({
                    chatId: realChatId,
                    title: chat.title
                }))

                // 🔥 5. move messages FIRST
                dispatch(moveMessages({
                    fromChatId: tempChatId,
                    toChatId: realChatId
                }))
            }

            // 🔥 6. ALWAYS replace in correct chat
            const targetChatId = chatId ? chatId : realChatId;

            dispatch(replaceThinkingMessage({
                chatId: targetChatId,
                content: aiMessage.content,
            }))

            dispatch(setCurrentChatId(realChatId))

        } catch (err) {
            console.error(err)
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const {chats} = data
        dispatch(setChats(chats.reduce((acc, chat)=>{
            acc[chat._id] = {
                id: chat._id,
                title:chat.title,
                messages:[],
                lastUpdated: chat.updatedAt
            }
            return acc
        },{})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId, chats) {
        if(chats[chatId]?.messages.length === 0){  
            const data = await getMessages(chatId)
            const formattedMessages = data.messages.map(msg => ({
                content : msg.content,
                role: msg.role
            }))
            dispatch(addMessages({
                chatId,
                messages: formattedMessages
            }))
        }
        dispatch(setCurrentChatId(chatId))
    }

    return{
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }
}