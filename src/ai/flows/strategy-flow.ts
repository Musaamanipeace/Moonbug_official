
'use server';
/**
 * @fileOverview Moonbug Strategy AI Flow.
 * 
 * Provides pedagogical advice and decision-making support for students.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StrategyInputSchema = z.object({
  query: z.string().describe('The user query or note content.'),
  context: z.string().optional().describe('Contextual info like current scope or type.'),
});
export type StrategyInput = z.infer<typeof StrategyInputSchema>;

const StrategyOutputSchema = z.object({
  insight: z.string().describe('The strategic advice or answer provided by the AI.'),
  suggestedAction: z.string().optional().describe('A concrete next step for the student.'),
});
export type StrategyOutput = z.infer<typeof StrategyOutputSchema>;

export async function getStrategyInsight(input: StrategyInput): Promise<StrategyOutput> {
  const { output } = await strategyPrompt(input);
  return output!;
}

const strategyPrompt = ai.definePrompt({
  name: 'strategyPrompt',
  input: { schema: StrategyInputSchema },
  output: { schema: StrategyOutputSchema },
  prompt: `You are the Moonbug Strategy Engine, a high-fidelity pedagogical AI assistant.
Your goal is to help students with decision-making, planning, and academic strategy.

Current User Input: {{{query}}}
System Context: {{{context}}}

Guidelines:
1. Be concise, encouraging, and highly professional.
2. If the user is asking for a plan, break it down into simple, manageable steps.
3. If they are expressing a note or idea, provide a one-sentence insight on how to expand it or relate it to their learning goals.
4. Focus on resource management (time, effort, focus).

Respond with a strategic insight and a suggested next action.`,
});

const strategyFlow = ai.defineFlow(
  {
    name: 'strategyFlow',
    inputSchema: StrategyInputSchema,
    outputSchema: StrategyOutputSchema,
  },
  async (input) => {
    const { output } = await strategyPrompt(input);
    return output!;
  }
);
