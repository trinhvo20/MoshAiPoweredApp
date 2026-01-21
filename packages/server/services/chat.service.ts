import fs from 'fs';
import path from 'path';
import OpenAI from "openai";
import { conversationRepository } from "../repositories/conversation.repository";
import template from '../prompts/chatbot.txt';

// Get OpenAI through API key
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Get the instruction prompt for that chatbot from chatbot.txt
const parkInfo = fs.readFileSync(path.join(__dirname, '..', 'prompts', 'WonderWorld.md'), 'utf-8')
const instructions = template.replace('{{parkInfo}}', parkInfo);

type ChatResponse = {
    id: string;
    message: string;
}


// Export public interface
export const chatService = {
    async sendMessage(prompt: string, conversationId: string): Promise<ChatResponse> {
        // and send to OpenAI
        const response = await client.responses.create({
            model: 'gpt-4o-mini',
            instructions,
            input: prompt,
            temperature: 0.2, // decide how logic/creative the answer is (0.2=logic, 1.0=creative)
            max_output_tokens: 200, // tokens
            previous_response_id: conversationRepository.getLastResponseId(conversationId)
        })
        
        // update the chatbox's memory
        conversationRepository.setLastResponseId(conversationId, response.id);

        return {
            id: response.id,
            message: response.output_text
        };
    }
}