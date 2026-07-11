'use client';
import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';
import { GhanaProviderHero } from '@/assets/images';
import { Logo } from '@/assets/images';
import { BRANDING } from '@/constants/branding.constant';
import { ArrowRight, Building2, Stethoscope, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProvidersHero = (): JSX.Element => (
  <section className="relative min-h-screen overflow-hidden bg-slate-950">
    {/* Background image with overlay */}
    <div className="absolute inset-0">
      <Image
        src={GhanaProviderHero}
        alt="Ghanaian healthcare providers using Fornix Link"
        fill
        className="object-cover object-center opacity-20"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-teal-950/80" />
    </div>

    {/* Animated glow blobs */}
    <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500 opacity-10 blur-3xl" />
    <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-400 opacity-8 blur-3xl" />

    {/* Navigation bar */}
    <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="Fornix Link logo" width={36} height={36} />
        <span className="text-lg font-black text-white">{BRANDING.APP_NAME}</span>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white/80 transition-all hover:border-white/40 hover:text-white"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to Patient Site
        </Link>
        <Link href="/login">
          <span className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white">
            Login
          </span>
        </Link>
        <Link href="/sign-up?role=doctor">
          <span className="rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-lg transition-all hover:brightness-110">
            Join Free
          </span>
        </Link>
      </div>
    </nav>

    {/* Hero content */}
    <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-16 text-center">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm font-semibold text-teal-300">
        <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />
        Powering Healthcare Providers Across Ghana
      </div>

      <h1 className="mb-6 max-w-5xl text-5xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
        The Platform Built for{' '}
        <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
          Modern Clinicians
        </span>
      </h1>

      <p className="mb-10 max-w-2xl text-xl text-slate-400">
        From independent doctors to full hospital networks — Fornix Link gives you AI-powered
        clinical tools, seamless scheduling, and access to a growing patient base across Ghana.
      </p>

      {/* CTAs */}
      <div className="mb-14 flex flex-col items-center gap-4 sm:flex-row">
        <Link href="/sign-up?role=doctor">
          <Button
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 px-8 py-4 text-base font-bold text-white shadow-xl transition-all hover:brightness-110 hover:shadow-2xl"
            child={
              <>
                <Stethoscope className="h-5 w-5" />
                Join as a Doctor — Free
                <ArrowRight className="h-4 w-4" />
              </>
            }
          />
        </Link>
        <Link href="/sign-up?role=hospital">
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-full border-white/20 px-8 py-4 text-base font-semibold text-white hover:bg-white/10"
            child={
              <>
                <Building2 className="h-5 w-5" />
                Register a Hospital
              </>
            }
          />
        </Link>
      </div>

      {/* Trust row */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
        {['150+ Verified Doctors', '20+ Partner Hospitals', 'GDPR Compliant', 'Accra · Kumasi · Tamale'].map(
          (item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              {item}
            </span>
          ),
        )}
      </div>
    </div>
  </section>
);

export default ProvidersHero;
