
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
  tone: z.string().optional().describe('The desired tone for the post.'),
  language: z.string().optional().describe('The desired language for the post.'),
  customInstructions: z.string().optional().describe('Any specific keywords or instructions.'),
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
  prompt: `You are an expert social media strategist. Based on the provided content description and creative direction, generate a list of 3-5 actionable suggestions to improve the post's impact and engagement.

The suggestions should be written in the specified language. If no language is specified, default to English.

Focus on the following areas, keeping the user's creative direction in mind:
- **Call to Action (CTA):** Suggest a clear, compelling CTA to encourage user interaction.
- **Engagement Questions:** Recommend questions to ask the audience to spark conversation.
- **Visual Storytelling:** Provide ideas to enhance the narrative or context of the image.
- **Audience Connection:** Offer tips on how to make the post more relatable or personal.

Content Description: {{{contentDescription}}}

Creative Direction:
{{#if tone}}
- Tone: {{{tone}}}
{{/if}}
{{#if language}}
- Language: {{{language}}}
{{/if}}
{{#if customInstructions}}
- Custom Instructions: {{{customInstructions}}}
{{/if}}

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
