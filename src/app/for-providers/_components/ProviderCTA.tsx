'use client';
import Link from 'next/link';
import { JSX } from 'react';
import { ArrowRight } from 'lucide-react';

const ProviderCTA = (): JSX.Element => (
  <section className="bg-slate-50 py-24 md:py-32">
    <div className="container mx-auto max-w-4xl px-4 text-center md:px-8">
      <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
        Ready to get started?
      </h2>
      <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-slate-500">
        Join 150+ doctors and 20+ hospitals already using Fornix Link to deliver better care, faster
        — across Ghana.
      </p>

      <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/sign-up?role=doctor"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-4 text-lg font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-teal-500 sm:w-auto"
        >
          Join as a Doctor
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Link
          href="/sign-up?role=hospital"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-lg font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-slate-800 sm:w-auto"
        >
          Register a Hospital
        </Link>
      </div>

      <p className="text-sm text-slate-400">
        Questions?{' '}
        <Link
          href="mailto:admin@fornixlink.com"
          className="text-teal-600 transition-colors hover:text-teal-700"
        >
          Contact our team
        </Link>{' '}
        — we typically respond within 2 hours.
      </p>
    </div>
  </section>
);

export default ProviderCTA;
