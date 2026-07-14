'use client';
import Link from 'next/link';
import { JSX } from 'react';
import { ArrowRight } from 'lucide-react';

const ProviderCTA = (): JSX.Element => (
  <section className="bg-slate-50 py-24 md:py-32">
    <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
      <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-6">
        Ready to get started?
      </h2>
      <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-12">
        Join 150+ doctors and 20+ hospitals already using Fornix Link to deliver better care,
        faster — across Ghana.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <Link
          href="/sign-up?role=doctor"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-teal-500 hover:-translate-y-0.5"
        >
          Join as a Doctor
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Link
          href="/sign-up?role=hospital"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-slate-800 hover:-translate-y-0.5"
        >
          Register a Hospital
        </Link>
      </div>

      <p className="text-sm text-slate-400">
        Questions?{' '}
        <Link
          href="mailto:admin@fornixlink.com"
          className="text-teal-600 hover:text-teal-700 transition-colors"
        >
          Contact our team
        </Link>
        {' '}— we typically respond within 2 hours.
      </p>
    </div>
  </section>
);

export default ProviderCTA;
