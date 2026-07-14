'use client';
import { JSX } from 'react';

const REASONS = [
  {
    num: '01',
    title: 'Verified care, always.',
    description:
      'Every doctor is licensed with the Ghana Medical and Dental Council. Every hospital and lab is accredited. We check before anyone appears in a search result.',
  },
  {
    num: '02',
    title: 'Book now, no back and forth.',
    description:
      `Real time availability means what you see is what you get. No calling to confirm a slot that's already taken.`,
  },
  {
    num: '03',
    title: 'Free cancellation.',
    description:
      'Plans change. Cancel or reschedule most appointments without a fee, right from your confirmation.',
  },
  {
    num: '04',
    title: 'Works everywhere.',
    description:
      'No app to download, no storage to clear. Fornix Link runs in your browser, on your phone, tablet or laptop, exactly the same every time.',
  },
];

const WhyBookWithUs = (): JSX.Element => (
  <section className="bg-white py-24 md:py-32 border-y border-slate-100">
    <div className="container mx-auto px-4 md:px-8 max-w-7xl">
      <div className="mb-20 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-tight">
          Why book with <span className="text-teal-600">Fornix Link</span>
        </h2>
        <p className="mt-6 text-xl text-slate-500 leading-relaxed">
          We built this for patients who are tired of calling, waiting, and not knowing. Here is what makes us different.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 lg:gap-x-24 lg:gap-y-20 max-w-5xl mx-auto">
        {REASONS.map((reason) => (
          <div key={reason.num} className="flex flex-col">
            <span className="text-sm font-bold tracking-widest text-teal-600 mb-4">
              {reason.num} —
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {reason.title}
            </h3>
            <p className="text-lg text-slate-500 leading-relaxed">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyBookWithUs;
