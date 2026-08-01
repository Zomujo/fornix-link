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
    description: `Real time availability means what you see is what you get. No calling to confirm a slot that's already taken.`,
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
  <section className="border-y border-slate-100 bg-white py-24 md:py-32">
    <div className="container mx-auto max-w-7xl px-4 md:px-8">
      <div className="mx-auto mb-20 max-w-3xl text-center">
        <h2 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Why book with <span className="text-teal-600">Fornix Link</span>
        </h2>
        <p className="mt-6 text-xl leading-relaxed text-slate-500">
          We built this for patients who are tired of calling, waiting, and not knowing. Here is
          what makes us different.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-16 gap-y-16 md:grid-cols-2 lg:gap-x-24 lg:gap-y-20">
        {REASONS.map((reason) => (
          <div key={reason.num} className="flex flex-col">
            <span className="mb-4 text-sm font-bold tracking-widest text-teal-600">
              {reason.num} —
            </span>
            <h3 className="mb-4 text-2xl font-bold text-slate-900">{reason.title}</h3>
            <p className="text-lg leading-relaxed text-slate-500">{reason.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyBookWithUs;
