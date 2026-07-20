'use client';
import Link from 'next/link';
import Image from 'next/image';
import { JSX } from 'react';
import { Logo } from '@/assets/images';
import { BRANDING } from '@/constants/branding.constant';
import { ArrowRight, ChevronLeft } from 'lucide-react';

const ProvidersHero = (): JSX.Element => (
  <section className="bg-white">
    {/* Nav */}
    <nav className="flex items-center justify-between px-6 py-5 md:px-10 max-w-7xl mx-auto">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt={`${BRANDING.APP_NAME} logo`} width={32} height={32} />
        <span className="text-lg font-black text-slate-900">{BRANDING.APP_NAME}</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Patient site
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          Login
        </Link>
        <Link
          href="/sign-up?role=doctor"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-500"
        >
          Join Free
        </Link>
      </div>
    </nav>

    {/* Hero content */}
    <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl leading-tight mb-6">
        Grow your practice with <span className="text-teal-600">Fornix Link</span>
      </h1>
      <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
        Whether you&apos;re an independent doctor or a full hospital — get AI-powered
        clinical tools, seamless scheduling, and access to a growing patient base across Ghana.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/sign-up?role=doctor"
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-teal-500 hover:-translate-y-0.5"
        >
          Join as a Doctor — Free
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Link
          href="/sign-up?role=hospital"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-slate-900 border border-slate-200 shadow-sm transition-all hover:border-slate-300 hover:-translate-y-0.5"
        >
          Register a Hospital
        </Link>
      </div>
    </div>
  </section>
);

export default ProvidersHero;
