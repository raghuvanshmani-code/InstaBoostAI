'use server';

/**
 * @fileOverview A flow to suggest relevant hashtags for a given content description.
 *
 * - suggestRelevantHashtags - A function that suggests relevant hashtags based on the content description.
 * - SuggestRelevantHashtagsInput - The input type for the suggestRelevantHashtags function.
 * - SuggestRelevantHashtagsOutput - The return type for the suggestRelevantHashtags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantHashtagsInputSchema = z.object({
  contentDescription: z
    .string()
    .describe(
      'A detailed description of the content (image or video) for which hashtags are to be suggested.'
    ),
});
export type SuggestRelevantHashtagsInput = z.infer<
  typeof SuggestRelevantHashtagsInputSchema
>;

const SuggestRelevantHashtagsOutputSchema = z.object({
  hashtags: z
    .array(z.string())
    .describe(
      'An array of relevant and trending hashtags that balance broad and niche appeal to optimize reach.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of the reasoning of why these hashtags were selected.'
    ),
});
export type SuggestRelevantHashtagsOutput = z.infer<
  typeof SuggestRelevantHashtagsOutputSchema
>;

export async function suggestRelevantHashtags(
  input: SuggestRelevantHashtagsInput
): Promise<SuggestRelevantHashtagsOutput> {
  return suggestRelevantHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantHashtagsPrompt',
  input: {schema: SuggestRelevantHashtagsInputSchema},
  output: {schema: SuggestRelevantHashtagsOutputSchema},
  prompt: `You are an AI expert in social media SEO, specializing in hashtag generation for Instagram.

  Given the following content description, suggest a list of relevant and trending hashtags that will increase the visibility of the post. Balance broad and niche appeal to optimize reach.

  Content Description: {{{contentDescription}}}

  Format the output as a JSON object with "hashtags" and "reasoning" fields.
  The hashtags should be an array of strings, and the reasoning should explain why these hashtags were selected.
  Do not add hashtags that are too general, make sure there is a good balance of hashtags to maximize SEO.
  Use your expert knowledge to provide the best results.`,
});

const suggestRelevantHashtagsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantHashtagsFlow',
    inputSchema: SuggestRelevantHashtagsInputSchema,
    outputSchema: SuggestRelevantHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
