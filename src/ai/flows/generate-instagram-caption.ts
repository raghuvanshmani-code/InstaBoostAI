
'use server';

/**
 * @fileOverview AI-powered Instagram caption generator.
 *
 * - generateInstagramCaption - A function that generates Instagram captions based on content analysis.
 * - GenerateInstagramCaptionInput - The input type for the generateInstagramCaption function.
 * - GenerateInstagramCaptionOutput - The return type for the generateInstagramCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInstagramCaptionInputSchema = z.object({
  contentDescription: z
    .string()
    .describe('A description of the image or video content.'),
  imageUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  tone: z.string().optional().describe('The desired tone for the captions (e.g., Casual, Formal, Humorous).'),
  language: z.string().optional().describe('The desired language for the captions (e.g., English, Spanish, French).'),
  customInstructions: z.string().optional().describe('Any specific keywords or instructions to include.'),
});
export type GenerateInstagramCaptionInput = z.infer<
  typeof GenerateInstagramCaptionInputSchema
>;

const GenerateInstagramCaptionOutputSchema = z.object({
  captions: z
    .array(z.string())
    .describe('An array of generated Instagram captions.'),
});
export type GenerateInstagramCaptionOutput = z.infer<
  typeof GenerateInstagramCaptionOutputSchema
>;

export async function generateInstagramCaption(
  input: GenerateInstagramCaptionInput
): Promise<GenerateInstagramCaptionOutput> {
  return generateInstagramCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInstagramCaptionPrompt',
  input: {schema: GenerateInstagramCaptionInputSchema},
  output: {schema: GenerateInstagramCaptionOutputSchema},
  prompt: `You are an AI-powered social media expert specializing in generating engaging Instagram captions.

  Based on the content description and image (if available), generate five different captions optimized for engagement.

  The user has provided the following creative direction:
  {{#if tone}}
  - Tone: {{{tone}}}
  {{/if}}
  {{#if language}}
  - Language: {{{language}}}
  {{/if}}
  {{#if customInstructions}}
  - Custom Instructions: {{{customInstructions}}}
  {{/if}}

  The captions should:
  *   Be creative and attention-grabbing
  *   Be relevant to the content
  *   Be written in the specified language. If no language is specified, default to English.
  *   Align with the specified tone and instructions.
  *   Include relevant emojis
  *   Vary in style (e.g., humorous, inspirational, informative)
  *   Do NOT include hashtags.

  Content Description: {{{contentDescription}}}
  {{#if imageUri}}
  Image: {{media url=imageUri}}
  {{/if}}

  Format the output as a JSON array of strings.`,
});

const generateInstagramCaptionFlow = ai.defineFlow(
  {
    name: 'generateInstagramCaptionFlow',
    inputSchema: GenerateInstagramCaptionInputSchema,
    outputSchema: GenerateInstagramCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
