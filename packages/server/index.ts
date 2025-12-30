import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { chatController } from './controllers/chat.controller';


// Store all variables in .env as Environment Variables
dotenv.config();

const app = express();

// return request as json object
app.use(express.json()); 

const port = process.env.PORT || 3000;

// TEST
app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
});

app.get('/api/hello', (req: Request, res: Response) => {
    res.json({message: "Hello"})
});

// MAIN
app.post('/api/chat', chatController.sendMessage)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});