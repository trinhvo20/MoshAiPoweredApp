import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { resolve } from 'bun';

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

app.post('/api/chat', async (req: Request, res: Response) => {
    const {prompt} = req.body; // grab the user's chat
    // and send to OpenAI
    const response = await client.responses.create({
        model: 'gpt-40-mini',
        input: prompt,
        temperature: 0.2, // decide how logic/creative the answer is (0.2=logic, 1.0=creative)
        max_output_tokens: 100 // tokens
    })
    // send the answer to user
    res.json({message: response.output_text})
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});