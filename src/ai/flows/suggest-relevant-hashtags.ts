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
      'Explanation of the reasoning of why these hashtags were selected, presented as bullet points with citations.'
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

  You must provide a "reasoning" for your selection as a series of concise bullet points. Each point should explain the strategic value of the hashtag choices, referencing how they align with current Instagram best practices for discoverability. Your tone should be that of a serious SEO expert.

  - Each bullet point must be research-based and impressive.
  - After each point, you MUST provide a citation from a reputable source (e.g., Later, Hootsuite, Sprout Social, or academic marketing journals). Format citations as "(Source: [Source Name], [Year])".

  Example reasoning format:
  *   "Combining high-volume tags like #travelphotography with niche tags like #icelandichorse creates a 'topic cluster' effect, improving visibility in both broad discovery feeds and specific interest groups. (Source: Hootsuite, 2023)"
  *   "The use of #adventuretravel taps into a community-driven hashtag with high engagement rates, fostering a sense of belonging and encouraging user interaction. (Source: Sprout Social, 2024)"

  Format the final output as a JSON object with "hashtags" and "reasoning" fields.`,
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
