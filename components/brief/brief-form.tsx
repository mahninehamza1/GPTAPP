'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { briefInputSchema, type BriefInput, type BriefRecord } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const steps = [
  { title: 'Company Info', fields: ['brandName', 'industry', 'market'] as const },
  { title: 'Business Context', fields: ['objective', 'problem', 'trigger'] as const },
  { title: 'Target Audience', fields: ['audience', 'audienceKnowledge'] as const },
  { title: 'Offer / Product', fields: ['offer', 'keyBenefits', 'reasonToBelieve'] as const },
  { title: 'Communication', fields: ['tone', 'mandatoryElements', 'budget', 'timeline'] as const },
];

const draftKey = 'brief-generator-draft-v1';

export function BriefForm() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<BriefRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const raw = localStorage.getItem(draftKey);
    return raw ? (JSON.parse(raw) as BriefInput) : undefined;
  }, []);

  const form = useForm<BriefInput>({
    resolver: zodResolver(briefInputSchema),
    defaultValues,
    mode: 'onTouched',
  });

  const watched = form.watch();
  if (typeof window !== 'undefined') localStorage.setItem(draftKey, JSON.stringify(watched));

  async function nextStep() {
    const valid = await form.trigger(steps[step].fields as unknown as (keyof BriefInput)[]);
    if (!valid) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  async function onSubmit(values: BriefInput) {
    setSubmitting(true);
    const response = await fetch('/api/briefs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const data = (await response.json()) as BriefRecord;
      setResult(data);
      localStorage.removeItem(draftKey);
      form.reset(values);
    }
    setSubmitting(false);
  }

  if (result) {
    return (
      <Card className="border-0 bg-white/90 shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle>Brief submitted successfully</CardTitle>
          <CardDescription>Your strategic brief has been generated and shared with your agency team.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto rounded-lg bg-secondary p-4 text-xs">{JSON.stringify(result.generatedBrief, null, 2)}</pre>
          <Button className="mt-4" onClick={() => setResult(null)}>
            Submit another brief
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <Card className="border-0 bg-white/90 shadow-lg backdrop-blur">
      <CardHeader>
        <div className="mb-3 h-2 w-full rounded-full bg-secondary">
          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <CardTitle>{steps[step].title}</CardTitle>
        <CardDescription>Step {step + 1} of {steps.length}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {step === 0 && (
            <>
              <Field label="Brand name"><Input {...form.register('brandName')} /></Field>
              <Field label="Industry"><Input {...form.register('industry')} /></Field>
              <Field label="Market"><Input {...form.register('market')} /></Field>
            </>
          )}
          {step === 1 && (
            <>
              <Field label="Business objective"><Textarea {...form.register('objective')} /></Field>
              <Field label="Current problem"><Textarea {...form.register('problem')} /></Field>
              <Field label="What triggered this request?"><Textarea {...form.register('trigger')} /></Field>
            </>
          )}
          {step === 2 && (
            <>
              <Field label="Who are you trying to reach?"><Textarea {...form.register('audience')} /></Field>
              <Field label="What do you know about them?"><Textarea {...form.register('audienceKnowledge')} /></Field>
            </>
          )}
          {step === 3 && (
            <>
              <Field label="What are you promoting?"><Input {...form.register('offer')} /></Field>
              <Field label="Key benefits"><Textarea {...form.register('keyBenefits')} /></Field>
              <Field label="Reason to believe"><Textarea {...form.register('reasonToBelieve')} /></Field>
            </>
          )}
          {step === 4 && (
            <>
              <Field label="Desired tone"><Input {...form.register('tone')} /></Field>
              <Field label="Mandatory elements"><Textarea {...form.register('mandatoryElements')} /></Field>
              <Field label="Budget (optional)"><Input {...form.register('budget')} /></Field>
              <Field label="Timeline"><Input {...form.register('timeline')} /></Field>
            </>
          )}

          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>Next</Button>
            ) : (
              <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Generate Brief'}</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
