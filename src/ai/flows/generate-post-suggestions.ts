'use server';

/**
 * @fileOverview AI-powered post suggestions generator.
 *
 * - generatePostSuggestions - A function that generates post suggestions based on content analysis.
 * - GeneratePostSuggestionsInput - The input type for the generatePostSuggestions function.
 * - GeneratePostSuggestionsOutput - The return type for the generatePostSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePostSuggestionsInputSchema = z.object({
  contentDescription: z
    .string()
    .describe('A description of the image or video content.'),
});
export type GeneratePostSuggestionsInput = z.infer<
  typeof GeneratePostSuggestionsInputSchema
>;

const GeneratePostSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of actionable suggestions to improve the post.'),
});
export type GeneratePostSuggestionsOutput = z.infer<
  typeof GeneratePostSuggestionsOutputSchema
>;

export async function generatePostSuggestions(
  input: GeneratePostSuggestionsInput
): Promise<GeneratePostSuggestionsOutput> {
  return generatePostSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePostSuggestionsPrompt',
  input: {schema: GeneratePostSuggestionsInputSchema},
  output: {schema: GeneratePostSuggestionsOutputSchema},
  prompt: `You are an expert social media strategist. Based on the provided content description, generate a list of 3-5 actionable suggestions to improve the post's impact and engagement.

Focus on the following areas:
- **Call to Action (CTA):** Suggest a clear, compelling CTA to encourage user interaction.
- **Engagement Questions:** Recommend questions to ask the audience to spark conversation.
- **Visual Storytelling:** Provide ideas to enhance the narrative or context of the image.
- **Audience Connection:** Offer tips on how to make the post more relatable or personal.

Content Description: {{{contentDescription}}}

Format the output as a JSON object with a "suggestions" field containing an array of strings.`,
});

const generatePostSuggestionsFlow = ai.defineFlow(
  {
    name: 'generatePostSuggestionsFlow',
    inputSchema: GeneratePostSuggestionsInputSchema,
    outputSchema: GeneratePostSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
