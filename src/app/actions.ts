
'use server';

import { analyzeContent } from '@/ai/flows/analyze-content';
import { generateInstagramCaption } from '@/ai/flows/generate-instagram-caption';
import { generatePostSuggestions } from '@/ai/flows/generate-post-suggestions';
import { suggestRelevantHashtags } from '@/ai/flows/suggest-relevant-hashtags';
import { z } from 'zod';

const inputSchema = z.object({
  imageUri: z.string(),
  tone: z.string().optional(),
  language: z.string().optional(),
  customInstructions: z.string().optional(),
});

export async function generateAllSuggestions(input: z.infer<typeof inputSchema>) {
  try {
    const validatedInput = inputSchema.parse(input);

    const analysisResult = await analyzeContent({ imageUri: validatedInput.imageUri });
    const contentDescription = analysisResult.description;

    const [captionResult, hashtagResult, suggestionsResult] = await Promise.all([
      generateInstagramCaption({
        contentDescription: contentDescription,
        imageUri: validatedInput.imageUri,
        tone: validatedInput.tone,
        language: validatedInput.language,
        customInstructions: validatedInput.customInstructions,
      }),
      suggestRelevantHashtags({ contentDescription: contentDescription }),
      generatePostSuggestions({ 
        contentDescription: contentDescription,
        tone: validatedInput.tone,
        language: validatedInput.language,
        customInstructions: validatedInput.customInstructions,
      }),
    ]);

    return {
      data: {
        description: contentDescription,
        captions: captionResult.captions,
        hashtags: hashtagResult.hashtags,
        hashtagReasoning: hashtagResult.reasoning,
        postSuggestions: suggestionsResult.suggestions,
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
