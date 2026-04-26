import type { BriefInput, GeneratedBrief } from '@/lib/schema';

export function generateBrief(input: BriefInput): GeneratedBrief {
  const insight = `The audience is likely balancing ${input.problem.toLowerCase()} while still expecting brands in ${input.industry} to feel relevant, trustworthy, and easy to choose.`;

  return {
    context: `${input.brandName} operates in ${input.industry} across ${input.market}. This request was triggered by: ${input.trigger}`,
    problem: input.problem,
    objective: input.objective,
    target: `${input.audience} | Known signals: ${input.audienceKnowledge}`,
    insight,
    strategy: `Position ${input.offer} as the most credible answer to the audience need by emphasizing ${input.keyBenefits.toLowerCase()} with proof anchored in ${input.reasonToBelieve.toLowerCase()}. The communication should maintain a ${input.tone.toLowerCase()} tone while including mandatory elements: ${input.mandatoryElements}.`,
    smp: `${input.offer} is the clearest way for ${input.audience.toLowerCase()} to achieve the outcome they care about most.`,
    deliverables: `Primary campaign assets aligned to a ${input.timeline} timeline${input.budget ? ` with a planning budget of ${input.budget}` : ''}. Include copy and design outputs that reinforce ${input.keyBenefits.toLowerCase()}.`,
  };
}
