'use client';
import { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const OngoingCare = (): JSX.Element => (
  <section className="bg-white py-20 md:py-24">
    <div className="container mx-auto px-4 md:px-8 max-w-6xl">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-16 sm:px-16 sm:py-20 text-center md:text-left min-h-[400px] flex items-center shadow-lg">
        
        {/* Background Image */}
        <Image
          src="/images/support_group_care.png"
          alt="Support group for chronic care"
          fill
          className="object-cover opacity-50"
          priority
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 w-full">
          <div className="flex-1 max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight mb-4 drop-shadow-md">
              Managing diabetes or hypertension?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl drop-shadow">
              Our partner clinics offer structured chronic care programs with predictable monthly pricing. Find a clinic that supports your condition.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/hospitals"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-teal-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-teal-900/50 transition-all hover:bg-teal-400 hover:-translate-y-0.5"
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
