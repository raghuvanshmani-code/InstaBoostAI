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
      'Explanation of the reasoning of why these hashtags were selected, presented in a structured format with citations.'
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
  prompt: `You are a world-class social media SEO strategist with a deep understanding of Instagram's algorithm and real-time trends. Your analysis is data-driven and focused on maximizing organic reach and engagement.

  Given the content description below, provide a meticulously curated list of hashtags. Your strategy should include:
  1.  **High-Volume Hashtags:** 2-3 popular hashtags to tap into broad trends.
  2.  **Niche-Specific Hashtags:** 5-7 hashtags that are highly relevant to the subject matter, targeting a specific community.
  3.  **Emerging/Trending Hashtags:** 1-2 hashtags that are currently gaining traction to capitalize on new waves of interest.

  Content Description: {{{contentDescription}}}

  You must provide a "reasoning" for your selection. The reasoning should be formatted as a string with clear headings for each hashtag category (High-Volume, Niche-Specific, Emerging/Trending). Under each heading, provide a concise, research-backed bullet point for the strategic value of the chosen tags. Include estimated reach increase percentages and cite a reputable source for each point.

  Example reasoning format:

  **High-Volume Strategy (Est. Reach: +30-40%)**
  *   Using tags like #travelphotography taps into a massive discovery pool. (Source: Hootsuite, 2024)

  **Niche-Specific Strategy (Est. Engagement: +50-70%)**
  *   Tags like #icelandichorse build a 'topic cluster,' signaling expertise and attracting a dedicated community. (Source: Sprout Social, 2023)

  **Trending Strategy (Est. Virality Chance: +15%)**
  *   Capitalizing on #solarpunkfuture taps into a growing aesthetic and conversation, increasing chances of being featured. (Source: Later, 2024)

  Format the final output as a JSON object with "hashtags" (an array of strings) and "reasoning" (a single formatted string) fields.`,
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
