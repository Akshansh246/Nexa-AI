import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {HumanMessage, SystemMessage, AIMessage, tool, createAgent} from 'langchain'
import {ChatMistralAI} from '@langchain/mistralai'
import * as z from 'zod'
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-flash-latest",
  apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model:'mistral-small-latest',
    apiKey:process.env.MISTRAL_API_KEY
})

const searchInternetTool = tool(
    searchInternet,
    {
        name:'searchInternet',
        description:'use this tool to get the lastest information from the internet.',
        schema: z.object({
            query: z.string().describe('the search query to search on the internet')
        })
    }
)

const agent = createAgent({
    model: mistralModel,
    tools: [searchInternetTool],
})


export async function generateResponse(messages) {
    const response = await agent.invoke({
        messages:[
            new SystemMessage(`
                You are a helpful assistant that answers questions based on the conversation history. You can use the following tool to search the internet for the latest information:
                "searchInternet(query: string): string" - use this tool to get the lastest information from the internet. You should use this tool when you don't know the answer to a question or when you need to get the latest information about a topic. Always use this tool when you are not sure about the answer or when you need to get the latest information. Do not hesitate to use this tool. The user expects you to use this tool when necessary. Always provide accurate and helpful answers to the user based on the conversation history and the information you can get from the internet using the searchInternet tool.
                `),
            ...messages.map(msg => {
            if(msg.role === 'user'){
                return new HumanMessage(msg.content)
            }else if(msg.role === 'ai'){
                return new AIMessage(msg.content)
            }
        })],
    })

    return response.messages[ response.messages.length - 1 ].text;
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