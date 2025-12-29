import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';

// Store all variables in .env as Environment Variables
dotenv.config();

// Get OpenAI through API key
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = express();

// return request as json object
app.use(express.json()); 

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
});

app.get('/api/hello', (req: Request, res: Response) => {
    res.json({message: "Hello"})
});

// build memory for this chatbox
// converstionId -> lastResponseId in that conversation
const conversations = new Map<string, string>();

// input validation (chat)
const chatSchema = z.object({
    prompt: z.string().trim().min(1, 'Prompt is required').max(1000, 'Prompt is too long (max 1000 characters)'),
    conversationId: z.string().uuid()
})

app.post('/api/chat', async (req: Request, res: Response) => {
    try {
        // validate the user's chat
        const parsedResult = chatSchema.safeParse(req.body);
        if (!parsedResult.success) {
            return res.status(400).json(parsedResult.error.format());
        }
        // grab the user's chat
        const {prompt, conversationId} = req.body; 
        
        // and send to OpenAI
        const response = await client.responses.create({
            model: 'gpt-4o-mini',
            input: prompt,
            temperature: 0.2, // decide how logic/creative the answer is (0.2=logic, 1.0=creative)
            max_output_tokens: 100, // tokens
            previous_response_id: conversations.get(conversationId)
        })
        
        // update the chatbox's memory
        conversations.set(conversationId, response.id);
        
        // send the answer to user
        res.json({message: response.output_text})
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "OpenAI request failed"})
    }

})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});