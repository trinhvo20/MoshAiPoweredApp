import OpenAI from "openai";    // ChatGPT model
import { InferenceClient } from "@huggingface/inference";   // HuggingFace model
import summarizePrompt from '../prompts/summarize-reviews-hg.txt';
import {Ollama} from 'ollama';

// Get OpenAI through API key
const openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const inferenceClient = new InferenceClient(process.env.HUGGING_FACE_TOKEN);

const ollamaClient = new Ollama();

type GenerateTextOptions = {
    model?: string;
    prompt: string;
    instructions?: string;
    temperature?: number;
    max_tokens?: number;
    previous_response_id?: string;
}

type GenerateTextResult = {
    id: string;
    output_text: string;
}

export const llmClient = { 
    async generateText({
        model = 'gpt-4.1', 
        prompt, 
        instructions,
        temperature = 0.2, 
        max_tokens = 300,
        previous_response_id
    }: GenerateTextOptions) : Promise<GenerateTextResult>
    {
        const response = await openAIClient.responses.create({
            model,
            input: prompt,
            instructions,
            temperature,
            max_output_tokens: max_tokens,
            previous_response_id
        });

        return {
            id: response.id,
            output_text: response.output_text
        };
    },

    async summarizeReviews(reviews: string) {
        const chatCompletion = await inferenceClient.chatCompletion({
            model: "meta-llama/Llama-3.1-8B-Instruct:novita",
            messages: [
                {
                    role: "system",
                    content: summarizePrompt,
                },
                {
                    role: "user",
                    content: reviews,
                },
            ],
        });
        return chatCompletion.choices[0]?.message.content || '';
    },

    async summarizeReviewsByOllama(reviews: string) {
        const response = await ollamaClient.chat({
            model: "tinyllama",
            messages: [
                {
                    role: "system",
                    content: summarizePrompt,
                },
                {
                    role: "user",
                    content: reviews,
                },
            ],
        });
        return response.message.content;
    }
};