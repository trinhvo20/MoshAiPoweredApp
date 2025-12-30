import OpenAI from "openai";
import { conversationRepository } from "../repositories/conversation.repository";

// Get OpenAI through API key
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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
            input: prompt,
            temperature: 0.2, // decide how logic/creative the answer is (0.2=logic, 1.0=creative)
            max_output_tokens: 100, // tokens
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