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

const StrategyPointSchema = z.object({
  point: z
    .string()
    .describe(
      'A concise, research-backed bullet point for the strategic value of the chosen tags.'
    ),
  source: z
    .string()
    .describe('The reputable source for the point (e.g., "Hootsuite, 2024").'),
});

const HashtagStrategySchema = z.object({
  title: z
    .string()
    .describe('The title of the strategy (e.g., "High-Volume Strategy").'),
  description: z.string().describe('A brief description of the strategy.'),
  estimatedReach: z
    .number()
    .describe(
      'The estimated reach increase as a percentage (e.g., 40 for +40%).'
    ),
  points: z
    .array(StrategyPointSchema)
    .describe('An array of strategic points backing the strategy.'),
});

const HashtagWithReachSchema = z.object({
  tag: z.string().describe('The hashtag, including the # symbol.'),
  reach: z
    .number()
    .describe(
      'Estimated potential reach score for the hashtag, from 0 to 100.'
    ),
});

const SuggestRelevantHashtagsOutputSchema = z.object({
  hashtags: z
    .array(HashtagWithReachSchema)
    .describe(
      'An array of relevant and trending hashtags, each with an estimated reach score, to optimize reach.'
    ),
  reasoning: z
    .object({
      highVolume: HashtagStrategySchema,
      niche: HashtagStrategySchema,
      trending: HashtagStrategySchema,
    })
    .describe('An object containing the reasoning for each hashtag strategy.'),
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

  Given the content description below, provide a meticulously curated list of hashtags and a structured analysis of your strategy.

  For the hashtags, provide an array of objects, where each object has:
  - A "tag" string: The hashtag itself (e.g., "#digitalart").
  - A "reach" number: An estimated potential reach score from 0 to 100, based on its current popularity and relevance.

  Your strategy should include three parts:
  1.  **High-Volume Hashtags:** 2-3 popular hashtags to tap into broad trends.
  2.  **Niche-Specific Hashtags:** 5-7 hashtags that are highly relevant to the subject matter, targeting a specific community.
  3.  **Emerging/Trending Hashtags:** 1-2 hashtags that are currently gaining traction to capitalize on new waves of interest.

  Content Description: {{{contentDescription}}}

  You must provide your reasoning as a structured JSON object. For each of the three strategies (highVolume, niche, trending), provide:
  - A title (e.g., "High-Volume Strategy").
  - A brief, one-sentence description of the strategy.
  - An estimated reach increase as a number (e.g., 40 for +40%).
  - An array of "points", where each point has:
    - A "point" string: A concise, research-backed bullet point on the strategic value.
    - A "source" string: The reputable source and year (e.g., "Hootsuite, 2024").

  Format the final output as a single JSON object with "hashtags" (an array of objects) and "reasoning" (a structured object) fields. Do not add any extra commentary.`,
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
