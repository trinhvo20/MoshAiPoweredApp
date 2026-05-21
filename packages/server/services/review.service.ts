import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';
import template from '../prompts/summarize-reviews.txt';

export const reviewService = {

    // Get AI summary of all reviews of a product
    async summarizeReviews(productId: number): Promise<string> {
        // Check if summary already exists in DB before generating a new one using AI
        const existingSummary = await reviewRepository.getSummary(productId);
        if (existingSummary) {
            return existingSummary;
        }
        
        // Get last 10 reviews from DB
        const reviews = await reviewRepository.getReviews(productId, 10);
        const joinedReviews = reviews.map(review => review.content).join('\n\n');
        const prompt = template.replace('{{reviews}}', joinedReviews);
        
        // ==========================================================================
        // OpenAI model
        // // Send last 10 reviews to AI to summary
        // const response = await llmClient.generateText({
        //     model: 'gpt-4.1',
        //     prompt,
        //     temperature: 0.2, // decide how logic/creative the answer is (0.2=logic, 1.0=creative)
        //     max_tokens: 500, 
        // })
        
        // const summary = response.output_text;
        
        // // Store summary to DB
        // await reviewRepository.storeSummary(productId, summary);
        
        // return summary;
        
        // ==========================================================================
        // Hugging Face model
        // const summary = await llmClient.summarizeReviews(joinedReviews)
        // await reviewRepository.storeSummary(productId, summary);
        // return summary;
        
        // ==========================================================================
        // Using Ollama to call Hugging Face model locally
        const summary = await llmClient.summarizeReviewsByOllama(joinedReviews)
        await reviewRepository.storeSummary(productId, summary);
        return summary;
    },
}