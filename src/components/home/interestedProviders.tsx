'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { GhanaProviderHero } from '@/assets/images';
import Link from 'next/link';
import { JSX } from 'react';

const BENEFITS = [
  'Reach patients in your area looking for a new provider',
  'Fill last-minute openings in your schedule',
  'Strengthen your online reputation with verified reviews',
  'AI-powered tools to streamline your clinical workflow',
];

const InterestedProvider = (): JSX.Element => (
  <section className="relative overflow-hidden py-24">
    {/* Deep teal-to-navy gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950" />

    {/* Decorative blob */}
    <div className="pointer-events-none absolute top-1/2 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500 opacity-10 blur-3xl" />

    <div className="relative z-10 container mx-auto px-4">
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* Image side */}
        <div className="relative lg:w-1/2">
          <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
            <Image
              src={GhanaProviderHero}
              alt="Ghanaian doctor using Fornix Link platform"
              className="h-auto w-full object-cover"
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -top-4 -right-4 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 px-5 py-3 shadow-xl">
            <p className="text-xs font-bold tracking-wide text-white uppercase">Powered by</p>
            <p className="text-lg font-black text-white">Fornix AI</p>
          </div>
        </div>

        {/* Content side */}
        <div className="lg:w-1/2">
          <span className="mb-4 inline-block rounded-full bg-teal-500/20 px-4 py-1.5 text-sm font-semibold text-teal-300 ring-1 ring-teal-500/30">
            For Providers
          </span>
          <h2 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
            Grow your practice with{' '}
            <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
              intelligent tools
            </span>
          </h2>
          <p className="mb-8 text-lg text-slate-400">
            Whether you&apos;re an independent doctor or a full hospital — Fornix Link gives you the
            technology to deliver exceptional care and run a smarter practice.
          </p>

          <div className="mb-10 space-y-4">
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="text-slate-300">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/for-providers">
              <Button
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
                child={
                  <>
                    Explore Provider Solutions
                    <ArrowRight className="h-5 w-5" />
                  </>
                }
              />
            </Link>
            <Link href="/sign-up?role=doctor">
              <Button
                variant="outline"
                className="rounded-xl border-white/20 px-8 py-4 text-base font-semibold text-white hover:bg-white/10"
                child="Join as a Doctor"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default InterestedProvider;
