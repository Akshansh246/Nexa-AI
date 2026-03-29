import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {HumanMessage, SystemMessage, AIMessage} from 'langchain'
import {ChatMistralAI} from '@langchain/mistralai'

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model:'mistral-small-latest',
    apiKey:process.env.MISTRAL_API_KEY
})


export async function generateResponse(messages) {
    const response = await geminiModel.invoke(messages.map(msg => {
        if(msg.role === 'user'){
            return new HumanMessage(msg.content)
        }else if(msg.role === 'ai'){
            return new AIMessage(msg.content)
        }
    }))

    return response.text
}

export async function generateChatTitle(message) {
    const response = await mistralModel.invoke([
        new SystemMessage(`
            You are a helpful assistant that generates a title for a chat based on the first message of the chat. The title should be concise and descriptive of the content of the chat. The title should be less than 2-4 words. The title should not contain any special characters. The title should be in English. The title should be in Title Case. The title should be unique and not used before. The title should be relevant to the content of the chat. The title should be catchy and attention-grabbing. The title should be easy to remember. The title should be creative and original. The title should be informative and accurate. The title should be engaging and interesting. The title should be appropriate for all audiences. The title should be suitable for a wide range of topics. The title should be able to stand out in a list of chat titles. The title should be able to attract users to click on the chat. The title should be able to give users an idea of what the chat is about. The title should be able to generate curiosity and interest in users. The title should be able to convey the main theme or topic of the chat in a clear and concise way.
        `),
        new HumanMessage(`
            Generate a title for chat conversation based on the following first message:
            "${message}"
        `)
    ])

    return response.text;
}