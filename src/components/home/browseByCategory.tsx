'use client';
import { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CategoryDoctorsWhimsical,
  CategoryHospitalsWhimsical,
  CategoryLabTestsWhimsical,
  CategoryPharmaciesWhimsical,
} from '@/assets/images';

const BrowseByCategory = (): JSX.Element => (
  <section id="features" className="bg-white py-24">
    <div className="container mx-auto px-4 md:px-8 max-w-7xl">
      <div className="mb-16 text-center">
        <span className="mb-4 inline-block rounded-full bg-teal-50 px-4 py-1.5 text-sm font-bold tracking-wide text-teal-700">
          Browse by Category
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
        
        {/* 1. Doctors (Wide Featured - col-span-2) */}
        <Link href="/find-doctors" className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl bg-teal-50/70 p-8 md:p-12 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2 border border-teal-100/50 cursor-pointer">
          <div className="flex-1 flex flex-col justify-center mb-8 md:mb-0 md:pr-8 z-10">
            <h3 className="mb-4 text-3xl font-extrabold text-slate-900">Doctors</h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              See a GP, pediatrician, OB-GYN or dentist, verified and ready to book.
            </p>
          </div>
          <div className="flex-1 relative min-h-[250px] md:min-h-full w-full">
            <Image
              src={CategoryDoctorsWhimsical}
              alt="Doctors"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
            />
          </div>
        </Link>

        {/* 2. Hospitals (Standard Square - col-span-1) */}
        <Link href="/hospitals" className="group relative flex flex-col items-center text-center overflow-hidden rounded-3xl bg-blue-50/70 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-1 border border-blue-100/50 cursor-pointer">
          <div className="relative h-28 w-28 mb-6 mt-4">
            <Image src={CategoryHospitalsWhimsical} alt="Hospitals" fill className="object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm" />
          </div>
          <h3 className="mb-2 text-2xl font-extrabold text-slate-900">Hospitals</h3>
          <p className="text-sm text-slate-600">
            Outpatient visits, admissions and specialist clinics across Ghana.
          </p>
        </Link>

        {/* 3. Lab Tests (Standard Square - col-span-1) */}
        <Link href="#" className="group relative flex flex-col items-center text-center overflow-hidden rounded-3xl bg-purple-50/70 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-1 border border-purple-100/50 cursor-pointer">
          <div className="relative h-28 w-28 mb-6 mt-4">
            <Image src={CategoryLabTestsWhimsical} alt="Lab Tests" fill className="object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm" />
          </div>
          <h3 className="mb-2 text-2xl font-extrabold text-slate-900">Lab Tests</h3>
          <p className="text-sm text-slate-600">
            Blood work, scans and imaging, with results you can trust.
          </p>
        </Link>

        {/* 4. Pharmacies (Wide Featured - col-span-2) */}
        <Link href="#" className="group relative flex flex-col md:flex-row-reverse overflow-hidden rounded-3xl bg-amber-50/70 p-8 md:p-12 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2 border border-amber-100/50 cursor-pointer">
          <div className="flex-1 flex flex-col justify-center mb-8 md:mb-0 md:pl-8 z-10 text-right md:text-left">
            <h3 className="mb-4 text-3xl font-extrabold text-slate-900">Pharmacies</h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              Order and collect medication from verified pharmacies near you.
            </p>
          </div>
          <div className="flex-1 relative min-h-[250px] md:min-h-full w-full">
            <Image
              src={CategoryPharmaciesWhimsical}
              alt="Pharmacies"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
            />
          </div>
        </Link>

      </div>
    </div>
  </section>
);

export default BrowseByCategory;
