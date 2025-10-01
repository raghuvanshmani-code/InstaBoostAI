
'use server';

import { analyzeContent } from '@/ai/flows/analyze-content';
import { generateInstagramCaption } from '@/ai/flows/generate-instagram-caption';
import { generatePostSuggestions } from '@/ai/flows/generate-post-suggestions';
import { suggestRelevantHashtags } from '@/ai/flows/suggest-relevant-hashtags';
import { z } from 'zod';

const inputSchema = z.object({
  imageUri: z.string(), // Can be a data URI or a public URL
  tone: z.string().optional(),
  language: z.string().optional(),
  customInstructions: z.string().optional(),
});

export async function generateAllSuggestions(input: z.infer<typeof inputSchema>) {
  try {
    const validatedInput = inputSchema.parse(input);

    // The imageUri can be either a data URI or a public URL.
    // The analyzeContent flow is designed to handle both.
    const analysisResult = await analyzeContent({ imageUri: validatedInput.imageUri });
    const contentDescription = analysisResult.description;

    const [captionResult, hashtagResult, suggestionsResult] = await Promise.all([
      generateInstagramCaption({
        contentDescription: contentDescription,
        imageUri: validatedInput.imageUri, // Pass URI to get more context
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
    // Provide a more generic error message to the user
    return { data: null, error: 'Failed to generate suggestions. An unexpected error occurred.' };
  }
}
