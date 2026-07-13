'use client';
import { JSX } from 'react';
import Image from 'next/image';
import {
  FeatureSpecialistWhimsical,
  FeatureCalendarWhimsical,
  FeatureTelehealthWhimsical,
  FeaturePaymentWhimsical,
  FeatureRecordsWhimsical,
  FeaturePrescriptionWhimsical,
} from '@/assets/images';

const AvailableFeatures = (): JSX.Element => (
  <section id="features" className="bg-white py-24">
    <div className="container mx-auto px-4 md:px-8 max-w-7xl">
      <div className="mb-16 text-center">
        <span className="mb-4 inline-block rounded-full bg-teal-50 px-4 py-1.5 text-sm font-bold tracking-wide text-teal-700">
          Everything You Need
        </span>
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          Healthcare, built around{' '}
          <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
            you
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-slate-500">
          Everything you need to manage your healthcare journey — all in one place.
        </p>
      </div>

      {/* Creative Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
        
        {/* 1. Specialist (Large Featured - col-span-2, row-span-2) */}
        <div className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl bg-teal-50/70 p-8 md:p-12 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2 md:row-span-2 border border-teal-100/50">
          <div className="flex-1 flex flex-col justify-center mb-8 md:mb-0 md:pr-8 z-10">
            <h3 className="mb-4 text-3xl font-extrabold text-slate-900">Find the Right Specialist</h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              Search by specialty, location, or name. Get verified profiles with real patient reviews to make the right choice.
            </p>
          </div>
          <div className="flex-1 relative min-h-[250px] md:min-h-full w-full">
            <Image
              src={FeatureSpecialistWhimsical}
              alt="Find Specialist"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
            />
          </div>
        </div>

        {/* 2. Calendar (Tall Featured - col-span-1, row-span-2) */}
        <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-emerald-50/70 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-1 md:row-span-2 border border-emerald-100/50">
          <div className="flex flex-col justify-center z-10 text-center">
            <h3 className="mb-4 text-2xl font-extrabold text-slate-900">Book in Seconds</h3>
            <p className="text-slate-600">
              Sync appointments with your calendar and get automatic SMS reminders.
            </p>
          </div>
          <div className="relative mt-8 flex-1 min-h-[200px] w-full">
            <Image
              src={FeatureCalendarWhimsical}
              alt="Book in Seconds"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-sm origin-bottom"
            />
          </div>
        </div>

        {/* 3. Telehealth (Standard Square) */}
        <div className="group relative flex flex-col items-center text-center overflow-hidden rounded-3xl bg-cyan-50/70 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-cyan-100/50">
          <div className="relative h-24 w-24 mb-6">
            <Image src={FeatureTelehealthWhimsical} alt="Telehealth" fill className="object-contain transition-transform duration-300 group-hover:scale-110" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-900">Telehealth</h3>
          <p className="text-sm text-slate-600">HD video consultations anytime, anywhere.</p>
        </div>

        {/* 4. Payments (Standard Square) */}
        <div className="group relative flex flex-col items-center text-center overflow-hidden rounded-3xl bg-slate-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-200/60">
          <div className="relative h-24 w-24 mb-6">
            <Image src={FeaturePaymentWhimsical} alt="Payments" fill className="object-contain transition-transform duration-300 group-hover:scale-110" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-900">Secure Payments</h3>
          <p className="text-sm text-slate-600">Mobile Money, card, or bank transfer.</p>
        </div>

        {/* 5. Records (Standard Square) */}
        <div className="group relative flex flex-col items-center text-center overflow-hidden rounded-3xl bg-purple-50/70 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-purple-100/50">
          <div className="relative h-24 w-24 mb-6">
            <Image src={FeatureRecordsWhimsical} alt="Records" fill className="object-contain transition-transform duration-300 group-hover:scale-110" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-900">Your Records</h3>
          <p className="text-sm text-slate-600">Securely store your entire medical history.</p>
        </div>

        {/* 6. Prescriptions (Wide Banner - col-span-3) */}
        <div className="group relative flex flex-col md:flex-row items-center overflow-hidden rounded-3xl bg-blue-50/50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-3 border border-blue-100/50">
          <div className="relative h-32 w-32 md:mr-10 mb-6 md:mb-0">
            <Image src={FeaturePrescriptionWhimsical} alt="Prescriptions" fill className="object-contain transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="mb-2 text-2xl font-bold text-slate-900">Digital Prescriptions</h3>
            <p className="text-slate-600 max-w-2xl">
              Receive and track prescriptions digitally. Send them directly to your pharmacy with one tap. No more lost paper slips.
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>
);

export default AvailableFeatures;
