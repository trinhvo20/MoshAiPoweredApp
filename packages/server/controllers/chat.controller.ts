import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

// input validation (chat)
const chatSchema = z.object({
    prompt: z.string().trim().min(1, 'Prompt is required').max(1000, 'Prompt is too long (max 1000 characters)'),
    conversationId: z.string().uuid()
})

// Export public interface
export const chatController = {
    async sendMessage(req: Request, res: Response) {
        // validate the user's chat
        const parsedResult = chatSchema.safeParse(req.body);
        if (!parsedResult.success) {
            return res.status(400).json(parsedResult.error.format());
        }
        
        try {
            // grab the user's chat
            const {prompt, conversationId} = req.body; 
            
            // get the response from AI
            const response = await chatService.sendMessage(prompt, conversationId);
            
            // send the answer (AI response) to user
            res.json({message: response.message})
        } 
        catch (err) {
            console.error(err);
            res.status(500).json({error: "OpenAI request failed"})
        }

    }
}