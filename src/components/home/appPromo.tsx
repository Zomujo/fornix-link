'use client';
import { JSX } from 'react';
import Link from 'next/link';
import { Smartphone, Bookmark, ArrowRight } from 'lucide-react';

const AppPromo = (): JSX.Element => (
  <section className="border-t border-slate-100 bg-slate-50 py-24 md:py-32">
    <div className="container mx-auto max-w-4xl px-4 text-center md:px-8">
      <div className="mb-8 flex justify-center gap-4">
        <div className="flex h-16 w-16 rotate-[-6deg] items-center justify-center rounded-2xl bg-teal-100 text-teal-600 shadow-sm">
          <Smartphone className="h-8 w-8" />
        </div>
        <div className="flex h-16 w-16 rotate-[6deg] items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
          <Bookmark className="h-8 w-8 fill-current" />
        </div>
      </div>

      <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
        Always with you.
      </h2>

      <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-slate-500">
        No heavy apps to download. Just add Fornix Link to your home screen or bookmark us, and
        you&apos;re always one tap away from care.
      </p>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/find-doctors"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-teal-900/20 transition-all hover:-translate-y-0.5 hover:bg-teal-500 sm:w-auto"
        >
          Find a Doctor
          <ArrowRight className="h-5 w-5" />
        </Link>

        <Link
          href="/hospitals"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
        >
          Find a Hospital
        </Link>
      </div>
    </div>
  </section>
);

export default AppPromo;
