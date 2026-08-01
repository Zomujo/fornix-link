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
    <div className="container mx-auto max-w-7xl px-4 md:px-8">
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
      <div className="grid auto-rows-[minmax(250px,auto)] grid-cols-1 gap-6 md:grid-cols-3">
        {/* 1. Specialist (Large Featured - col-span-2, row-span-2) */}
        <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-teal-100/50 bg-teal-50/70 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2 md:row-span-2 md:flex-row md:p-12">
          <div className="z-10 mb-8 flex flex-1 flex-col justify-center md:mb-0 md:pr-8">
            <h3 className="mb-4 text-3xl font-extrabold text-slate-900">
              Find the Right Specialist
            </h3>
            <p className="text-lg leading-relaxed text-slate-600">
              Search by specialty, location, or name. Get verified profiles with real patient
              reviews to make the right choice.
            </p>
          </div>
          <div className="relative min-h-[250px] w-full flex-1 md:min-h-full">
            <Image
              src={FeatureSpecialistWhimsical}
              alt="Find Specialist"
              fill
              className="object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* 2. Calendar (Tall Featured - col-span-1, row-span-2) */}
        <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-emerald-100/50 bg-emerald-50/70 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-1 md:row-span-2">
          <div className="z-10 flex flex-col justify-center text-center">
            <h3 className="mb-4 text-2xl font-extrabold text-slate-900">Book in Seconds</h3>
            <p className="text-slate-600">
              Sync appointments with your calendar and get automatic SMS reminders.
            </p>
          </div>
          <div className="relative mt-8 min-h-[200px] w-full flex-1">
            <Image
              src={FeatureCalendarWhimsical}
              alt="Book in Seconds"
              fill
              className="origin-bottom object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>

        {/* 3. Telehealth (Standard Square) */}
        <div className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-cyan-100/50 bg-cyan-50/70 p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="relative mb-6 h-24 w-24">
            <Image
              src={FeatureTelehealthWhimsical}
              alt="Telehealth"
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-900">Telehealth</h3>
          <p className="text-sm text-slate-600">HD video consultations anytime, anywhere.</p>
        </div>

        {/* 4. Payments (Standard Square) */}
        <div className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-slate-200/60 bg-slate-50 p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="relative mb-6 h-24 w-24">
            <Image
              src={FeaturePaymentWhimsical}
              alt="Payments"
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-900">Secure Payments</h3>
          <p className="text-sm text-slate-600">Mobile Money, card, or bank transfer.</p>
        </div>

        {/* 5. Records (Standard Square) */}
        <div className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-purple-100/50 bg-purple-50/70 p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="relative mb-6 h-24 w-24">
            <Image
              src={FeatureRecordsWhimsical}
              alt="Records"
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-900">Your Records</h3>
          <p className="text-sm text-slate-600">Securely store your entire medical history.</p>
        </div>

        {/* 6. Prescriptions (Wide Banner - col-span-3) */}
        <div className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-blue-100/50 bg-blue-50/50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-3 md:flex-row">
          <div className="relative mb-6 h-32 w-32 md:mr-10 md:mb-0">
            <Image
              src={FeaturePrescriptionWhimsical}
              alt="Prescriptions"
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="mb-2 text-2xl font-bold text-slate-900">Digital Prescriptions</h3>
            <p className="max-w-2xl text-slate-600">
              Receive and track prescriptions digitally. Send them directly to your pharmacy with
              one tap. No more lost paper slips.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AvailableFeatures;
