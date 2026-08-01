'use client';
import { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const OngoingCare = (): JSX.Element => (
  <section className="bg-white py-20 md:py-24">
    <div className="container mx-auto max-w-6xl px-4 md:px-8">
      <div className="relative flex min-h-[400px] items-center overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-16 text-center shadow-lg sm:px-16 sm:py-20 md:text-left">
        {/* Background Image */}
        <Image
          src="/images/support_group_care.png"
          alt="Support group for chronic care"
          fill
          className="object-cover opacity-50"
          priority
        />

        <div className="relative z-10 flex w-full flex-col items-center justify-between gap-10 md:flex-row">
          <div className="max-w-2xl flex-1">
            <h2 className="mb-4 text-3xl leading-tight font-extrabold tracking-tight text-white drop-shadow-md sm:text-5xl">
              Managing diabetes or hypertension?
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-white/90 drop-shadow sm:text-xl">
              Our partner clinics offer structured chronic care programs with predictable monthly
              pricing. Find a clinic that supports your condition.
            </p>
          </div>

          <div className="w-full shrink-0 md:w-auto">
            <Link
              href="/hospitals"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-teal-900/50 transition-all hover:-translate-y-0.5 hover:bg-teal-400 sm:w-auto"
            >
              Find programs
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default OngoingCare;
