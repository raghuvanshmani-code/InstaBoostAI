'use server';

/**
 * @fileOverview Provides SEO optimization tips based on the content provided.
 *
 * - provideSeoOptimizationTips - A function that provides SEO optimization tips.
 * - ProvideSeoOptimizationTipsInput - The input type for the provideSeoOptimizationTips function.
 * - ProvideSeoOptimizationTipsOutput - The return type for the provideSeoOptimizationTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideSeoOptimizationTipsInputSchema = z.object({
  contentDescription: z
    .string()
    .describe("A description of the content for which SEO tips are needed."),
});
export type ProvideSeoOptimizationTipsInput = z.infer<
  typeof ProvideSeoOptimizationTipsInputSchema
>;

const ProvideSeoOptimizationTipsOutputSchema = z.object({
  seoTips: z
    .string()
    .describe("SEO optimization tips to improve content visibility."),
});
export type ProvideSeoOptimizationTipsOutput = z.infer<
  typeof ProvideSeoOptimizationTipsOutputSchema
>;

export async function provideSeoOptimizationTips(
  input: ProvideSeoOptimizationTipsInput
): Promise<ProvideSeoOptimizationTipsOutput> {
  return provideSeoOptimizationTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideSeoOptimizationTipsPrompt',
  input: {schema: ProvideSeoOptimizationTipsInputSchema},
  output: {schema: ProvideSeoOptimizationTipsOutputSchema},
  prompt: `You are an SEO expert. Provide SEO optimization tips for the following content description to improve its visibility:\n\nContent Description: {{{contentDescription}}}\n\nSEO Tips:`,
});

const provideSeoOptimizationTipsFlow = ai.defineFlow(
  {
    name: 'provideSeoOptimizationTipsFlow',
    inputSchema: ProvideSeoOptimizationTipsInputSchema,
    outputSchema: ProvideSeoOptimizationTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
