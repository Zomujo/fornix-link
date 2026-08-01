'use client';
import { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BrowseByCategory = (): JSX.Element => (
  <section id="features" className="bg-white py-24">
    <div className="container mx-auto max-w-7xl px-4 md:px-8">
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
      <div className="grid auto-rows-[minmax(300px,auto)] grid-cols-1 gap-6 md:grid-cols-3">
        {/* 1. Doctors (Wide Featured - col-span-2) */}
        <Link
          href="/find-doctors"
          className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-teal-100 bg-teal-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2 md:flex-row md:p-8"
        >
          <div className="z-10 mb-6 flex flex-1 flex-col justify-center md:mb-0 md:pr-8">
            <h3 className="mb-4 text-3xl font-extrabold text-slate-900">Doctors</h3>
            <p className="text-lg leading-relaxed text-slate-600">
              See a GP, pediatrician, OB-GYN or dentist, verified and ready to book.
            </p>
          </div>
          <div className="relative min-h-[200px] w-full flex-1 overflow-hidden rounded-2xl shadow-md md:min-h-[240px]">
            <Image
              src="/images/category_doctors_real.png"
              alt="Professional African doctor in modern clinic"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* 2. Hospitals (Standard Square - col-span-1) */}
        <Link
          href="/hospitals"
          className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-1"
        >
          <div className="relative mb-6 h-40 w-full overflow-hidden rounded-2xl shadow-md">
            <Image
              src="/images/category_hospitals_real.png"
              alt="Modern hospital exterior"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <h3 className="mb-2 text-2xl font-extrabold text-slate-900">Hospitals</h3>
          <p className="text-sm text-slate-600">
            Outpatient visits, admissions and specialist clinics across Ghana.
          </p>
        </Link>

        {/* 3. Lab Tests (Standard Square - col-span-1) */}
        <Link
          href="#"
          className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-purple-100 bg-purple-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-1"
        >
          <div className="relative mb-6 h-40 w-full overflow-hidden rounded-2xl shadow-md">
            <Image
              src="/images/category_lab_tests_real.png"
              alt="Modern medical laboratory"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <h3 className="mb-2 text-2xl font-extrabold text-slate-900">Lab Tests</h3>
          <p className="text-sm text-slate-600">
            Blood work, scans and imaging, with results you can trust.
          </p>
        </Link>

        {/* 4. Pharmacies (Wide Featured - col-span-2) */}
        <Link
          href="#"
          className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-amber-100 bg-amber-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2 md:flex-row-reverse md:p-8"
        >
          <div className="z-10 mb-6 flex flex-1 flex-col justify-center text-left md:mb-0 md:pl-8">
            <h3 className="mb-4 text-3xl font-extrabold text-slate-900">Pharmacies</h3>
            <p className="text-lg leading-relaxed text-slate-600">
              Order and collect medication from verified pharmacies near you.
            </p>
          </div>
          <div className="relative min-h-[200px] w-full flex-1 overflow-hidden rounded-2xl shadow-md md:min-h-[240px]">
            <Image
              src="/images/category_pharmacies_real.png"
              alt="Bright modern pharmacy"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Link>
      </div>
    </div>
  </section>
);

export default BrowseByCategory;
