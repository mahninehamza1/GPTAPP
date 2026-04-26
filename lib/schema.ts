import { z } from 'zod';

export const briefInputSchema = z.object({
  brandName: z.string().min(2, 'Brand name is required.'),
  industry: z.string().min(2, 'Industry is required.'),
  market: z.string().min(2, 'Market is required.'),
  objective: z.string().min(10, 'Please provide enough context for your objective.'),
  problem: z.string().min(10, 'Please describe the problem.'),
  trigger: z.string().min(10, 'Please share what triggered this request.'),
  audience: z.string().min(10, 'Please define who you are trying to reach.'),
  audienceKnowledge: z.string().min(10, 'Please share what you know about this audience.'),
  offer: z.string().min(5, 'Please describe what you are promoting.'),
  keyBenefits: z.string().min(10, 'Please provide key benefits.'),
  reasonToBelieve: z.string().min(10, 'Please provide supporting proof points.'),
  tone: z.string().min(3, 'Desired tone is required.'),
  mandatoryElements: z.string().min(3, 'Please provide mandatory communication elements.'),
  budget: z.string().optional().default(''),
  timeline: z.string().min(3, 'Timeline is required.'),
});

export type BriefInput = z.infer<typeof briefInputSchema>;

export type GeneratedBrief = {
  context: string;
  problem: string;
  objective: string;
  target: string;
  insight: string;
  strategy: string;
  smp: string;
  deliverables: string;
};

export type BriefRecord = {
  id: string;
  createdAt: string;
  input: BriefInput;
  generatedBrief: GeneratedBrief;
};
