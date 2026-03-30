import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name:'chat',
    initialState:{
        chats:{},
        currentChatId:null,
        isLoading:false,
        error:null
    },
    reducers:{
        createNewChat: (state, action) => {
            const {chatId, title} = action.payload
            state.chats[ chatId ] = {
                id:  chatId,
                title,
                messages:[],
                lastUpdated: new Date().toISOString(),
            }
        },
        addNewMessage: (state, action) => {
            const {chatId, content, role, isThinking} = action.payload
            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    messages: []
                }
            }
            state.chats[chatId].messages.push({content, role, isThinking:isThinking||false})
        },
        addMessages: (state, action) => {
            const {chatId, messages} = action.payload
            state.chats[chatId].messages.push(...messages)
        },
        addUserMessage: (state, action) => {
            const { chatId, message } = action.payload;

            state.chats[chatId].messages.push({
                role: "user",
                content: message,
            });
        },
        addThinkingMessage: (state, action) => {
            const { chatId } = action.payload;

            state.chats[chatId].messages.push({
                role: "ai",
                content: "Thinking...",
                isThinking: true,
            });
        },  
        replaceThinkingMessage: (state, action) => {
            const { chatId, content } = action.payload;

            const messages = state.chats[chatId]?.messages;
            if (!messages || messages.length === 0) return;

            const lastMessage = messages[messages.length - 1];

            if (lastMessage?.isThinking) {
                lastMessage.content = content;
                lastMessage.isThinking = false;
            }
        },
        moveMessages: (state, action) => {
            const { fromChatId, toChatId } = action.payload;

            if (!state.chats[fromChatId]) return;

            state.chats[toChatId] = {
                ...state.chats[fromChatId],
            };

            delete state.chats[fromChatId];
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
    }
})

export const {setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages, addThinkingMessage, addUserMessage, replaceThinkingMessage, moveMessages} = chatSlice.actions
export default chatSlice.reducer