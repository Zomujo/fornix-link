'use client';
import { JSX } from 'react';
import Link from 'next/link';
import { Smartphone, Bookmark, ArrowRight } from 'lucide-react';

const AppPromo = (): JSX.Element => (
  <section className="bg-slate-50 py-24 md:py-32 border-t border-slate-100">
    <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
      
      <div className="mb-8 flex justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 shadow-sm rotate-[-6deg]">
          <Smartphone className="h-8 w-8" />
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm rotate-[6deg]">
          <Bookmark className="h-8 w-8 fill-current" />
        </div>
      </div>

      <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-6">
        Always with you.
      </h2>
      
      <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-12">
        No heavy apps to download. Just add Fornix Link to your home screen or bookmark us, and you're always one tap away from care.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/find-doctors"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-teal-900/20 transition-all hover:bg-teal-500 hover:-translate-y-0.5"
        >
          Find a Doctor
          <ArrowRight className="h-5 w-5" />
        </Link>
        
        <Link
          href="/hospitals"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-slate-900 border border-slate-200 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5"
        >
          Find a Hospital
        </Link>
      </div>

    </div>
  </section>
);

export default AppPromo;
