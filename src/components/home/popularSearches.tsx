'use client';
import { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock } from 'lucide-react';

const popularItems = [
  {
    title: 'General checkup',
    location: 'Accra',
    availability: 'Next available today',
    tag: 'bg-teal-100 text-teal-700',
  },
  {
    title: 'Blood work panel',
    location: 'Kumasi',
    availability: 'Results in 24 hours',
    tag: 'bg-purple-100 text-purple-700',
  },
  {
    title: 'Pediatrician visit',
    location: 'Accra',
    availability: 'Same day slots open',
    tag: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Dental cleaning',
    location: 'Tema',
    availability: 'Book this week',
    tag: 'bg-amber-100 text-amber-700',
  },
  {
    title: 'Antenatal checkup',
    location: 'Kumasi',
    availability: 'Next available tomorrow',
    tag: 'bg-emerald-100 text-emerald-700',
  },
];

const PopularSearches = (): JSX.Element => (
  <section className="bg-slate-50 py-20 md:py-28">
    <div className="container mx-auto max-w-7xl px-4 md:px-8">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.6fr]">
        {/* Left — sticky headline */}
        <div className="lg:sticky lg:top-24">
          <span className="mb-4 inline-block rounded-full bg-teal-50 px-4 py-1.5 text-sm font-bold tracking-wide text-teal-700">
            Popular Right Now
          </span>
          <h2 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            People are
            <br />
            booking
            <br />
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
              these today
            </span>
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-slate-500">
            Real-time availability across Ghana. See what&apos;s open right now in your city.
          </p>
          <Link
            href="/hospitals"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-7 py-4 text-base font-bold text-white shadow-md shadow-teal-200 transition-all hover:-translate-y-0.5 hover:bg-teal-500"
          >
            See what&apos;s available near you
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Right — item list */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {popularItems.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6 ${
                index !== popularItems.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              {/* Mobile top row: Number + Title */}
              <div className="flex items-center gap-4 sm:w-16 sm:shrink-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-base font-semibold text-slate-900 sm:hidden">
                  {item.title}
                </span>
              </div>

              {/* Desktop Title */}
              <div className="hidden flex-1 text-base font-semibold text-slate-900 sm:block">
                {item.title}
              </div>

              {/* Metadata (Location & Tag) */}
              <div className="ml-[52px] flex flex-wrap items-center gap-3 sm:ml-0 sm:shrink-0">
                <div className="flex items-center gap-1.5 text-sm text-slate-500 sm:w-24">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                  <span>{item.location}</span>
                </div>
                <div className="sm:w-48 sm:text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${item.tag}`}
                  >
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span className="whitespace-nowrap">{item.availability}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default PopularSearches;
