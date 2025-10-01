
'use server';

/**
 * @fileOverview AI-powered content analysis.
 *
 * - analyzeContent - A function that analyzes content and generates a description.
 * - AnalyzeContentInput - The input type for the analyzeContent function.
 * - AnalyzeContentOutput - The return type for the analyzeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeContentInputSchema = z.object({
  imageUri: z
    .string()
    .describe(
      "A photo of content, as a data URI or public URL. If data URI, it must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeContentInput = z.infer<typeof AnalyzeContentInputSchema>;

const AnalyzeContentOutputSchema = z.object({
  description: z.string().describe('A detailed analysis of the image content, objects, and themes, written from the perspective of the person who uploaded the image.'),
});
export type AnalyzeContentOutput = z.infer<typeof AnalyzeContentOutputSchema>;

export async function analyzeContent(
  input: AnalyzeContentInput
): Promise<AnalyzeContentOutput> {
  return analyzeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeContentPrompt',
  input: {schema: AnalyzeContentInputSchema},
  output: {schema: AnalyzeContentOutputSchema},
  prompt: `You are an expert at analyzing images and writing compelling descriptions from the perspective of the uploader.

Analyze the given image to understand its context, objects, themes, and emotional tone. Then, write a detailed and engaging description of the image as if you were the person who took or uploaded it. Your description should be personal and interesting.

For example, instead of "A person is standing on a mountain," you might write "Here I am at the top of the mountain, feeling on top of the world after a long hike!"

Image: {{media url=imageUri}}

Format the output as a JSON object with a "description" field.`,
});

const analyzeContentFlow = ai.defineFlow(
  {
    name: 'analyzeContentFlow',
    inputSchema: AnalyzeContentInputSchema,
    outputSchema: AnalyzeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
