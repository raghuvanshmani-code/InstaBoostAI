
'use server';

import { generateInstagramCaption } from '@/ai/flows/generate-instagram-caption';
import { provideSeoOptimizationTips } from '@/ai/flows/provide-seo-optimization-tips';
import { suggestRelevantHashtags } from '@/ai/flows/suggest-relevant-hashtags';
import { z } from 'zod';

const inputSchema = z.object({
  contentDescription: z.string().min(1, 'Content description cannot be empty.'),
  imageUri: z.string().optional(),
});

export async function generateAllSuggestions(input: z.infer<typeof inputSchema>) {
  try {
    const validatedInput = inputSchema.parse(input);

    const [captionResult, hashtagResult, seoResult] = await Promise.all([
      generateInstagramCaption({
        contentDescription: validatedInput.contentDescription,
        imageUri: validatedInput.imageUri,
      }),
      suggestRelevantHashtags({ contentDescription: validatedInput.contentDescription }),
      provideSeoOptimizationTips({ contentDescription: validatedInput.contentDescription }),
    ]);

    return {
      data: {
        captions: captionResult.captions,
        hashtags: hashtagResult.hashtags,
        hashtagReasoning: hashtagResult.reasoning,
        seoTips: seoResult.seoTips,
      },
      error: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, error: error.errors.map((e) => e.message).join(', ') };
    }
    console.error('Error generating suggestions:', error);
    return { data: null, error: 'Failed to generate suggestions. Please try again later.' };
  }
}
