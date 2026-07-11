'use client';
import { JSX } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_HOSPITALS = [
  { name: 'Korle-Bu Teaching Hospital', location: 'Accra', color: 'bg-teal-50', iconColor: 'text-teal-600' },
  { name: 'Komfo Anokye Teaching Hospital', location: 'Kumasi', color: 'bg-blue-50', iconColor: 'text-blue-600' },
  { name: '37 Military Hospital', location: 'Accra', color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { name: 'Ridge Regional Hospital', location: 'Accra', color: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { name: 'Tema General Hospital', location: 'Tema', color: 'bg-amber-50', iconColor: 'text-amber-600' },
  { name: 'Nyaho Medical Centre', location: 'Accra', color: 'bg-rose-50', iconColor: 'text-rose-600' },
];

const DiscoverHospitals = (): JSX.Element => (
  <section className="relative overflow-hidden bg-white py-24">
    <div className="container relative z-10 mx-auto px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <h2 className="mb-4 text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Discover Top Hospitals
          </h2>
          <p className="text-xl text-slate-500 font-medium">
            We partner with the best healthcare institutions across the country to bring you world-class care, instantly accessible.
          </p>
        </div>
        
        <Link href="/hospitals" className="hidden md:block shrink-0">
          <Button 
            className="rounded-full bg-teal-600 px-8 py-6 text-lg font-bold text-white hover:bg-teal-700 transition-all shadow-lg flex items-center gap-2"
            child={
              <>
                Book a Hospital <ArrowRight className="h-5 w-5" />
              </>
            }
          />
        </Link>
      </div>
    </div>

    {/* Infinite Auto-Scrolling Marquee */}
    <div className="relative flex overflow-hidden group pb-8">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-white to-transparent md:w-64"></div>
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-white to-transparent md:w-64"></div>

      <motion.div
        animate={{ x: [0, -1920] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          },
        }}
        className="flex gap-6 w-max px-6 cursor-grab active:cursor-grabbing"
      >
        {/* Double the array for seamless infinite scroll */}
        {[...MOCK_HOSPITALS, ...MOCK_HOSPITALS, ...MOCK_HOSPITALS].map((hospital, index) => (
          <div
            key={index}
            className="flex w-[320px] shrink-0 flex-col justify-between rounded-[2rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/60"
          >
            <div className="mb-6">
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${hospital.color}`}>
                <Building2 className={`h-8 w-8 ${hospital.iconColor}`} />
              </div>
              <h3 className="mb-2 text-xl font-extrabold text-slate-900 leading-tight">
                {hospital.name}
              </h3>
            </div>
            
            <div className="mt-auto flex items-center gap-2 text-slate-500 font-medium bg-slate-50 rounded-xl px-4 py-2 w-max">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{hospital.location}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>

    {/* Mobile CTA */}
    <div className="container mx-auto px-4 mt-8 flex justify-center md:hidden">
      <Link href="/hospitals" className="w-full">
        <Button 
          className="w-full rounded-full bg-teal-600 px-8 py-6 text-lg font-bold text-white hover:bg-teal-700 transition-all shadow-lg flex items-center justify-center gap-2"
          child={
            <>
              Book a Hospital <ArrowRight className="h-5 w-5" />
            </>
          }
        />
      </Link>
    </div>

  </section>
);

export default DiscoverHospitals;
