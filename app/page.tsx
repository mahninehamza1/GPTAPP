import { BriefForm } from '@/components/brief/brief-form';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Agency Brief Generator</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Tell us about your brief in 5 focused steps.</h1>
        <p className="max-w-2xl text-muted-foreground">
          Share business context, audience, and communication goals. We will transform your input into a clear, strategic brief.
        </p>
      </div>
      <BriefForm />
    </main>
  );
}
