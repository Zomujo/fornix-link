'use client';
import { JSX } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  HospitalKorleBu,
  HospitalKomfoAnokye,
  Hospital37Military,
  HospitalRidge,
  HospitalTema,
  HospitalNyaho,
} from '@/assets/images';

const MOCK_HOSPITALS = [
  { name: 'Korle-Bu Teaching Hospital', location: 'Accra', image: HospitalKorleBu },
  { name: 'Komfo Anokye Teaching Hospital', location: 'Kumasi', image: HospitalKomfoAnokye },
  { name: '37 Military Hospital', location: 'Accra', image: Hospital37Military },
  { name: 'Ridge Regional Hospital', location: 'Accra', image: HospitalRidge },
  { name: 'Tema General Hospital', location: 'Tema', image: HospitalTema },
  { name: 'Nyaho Medical Centre', location: 'Accra', image: HospitalNyaho },
];

const DiscoverHospitals = (): JSX.Element => (
  <section className="relative overflow-hidden bg-white py-24">
    <div className="relative z-10 container mx-auto max-w-7xl px-4">
      <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <h2 className="mb-4 text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Discover Top Hospitals
          </h2>
          <p className="text-xl font-medium text-slate-500">
            We partner with the best healthcare institutions across the country to bring you
            world-class care, instantly accessible.
          </p>
        </div>

        <Link href="/hospitals" className="hidden shrink-0 md:block">
          <Button
            className="flex items-center gap-2 rounded-full bg-teal-600 px-8 py-6 text-lg font-bold text-white shadow-lg transition-all hover:bg-teal-700"
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
    <div className="group relative flex overflow-hidden pb-8">
      {/* Fade edges */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent md:w-64"></div>
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24 bg-gradient-to-l from-white to-transparent md:w-64"></div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -2000, right: 0 }}
        whileDrag={{ cursor: 'grabbing' }}
        animate={{ x: [0, -1920] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 40,
            ease: 'linear',
          },
        }}
        className="flex w-max cursor-grab gap-6 px-6 active:cursor-grabbing"
      >
        {/* Double the array for seamless infinite scroll */}
        {[...MOCK_HOSPITALS, ...MOCK_HOSPITALS, ...MOCK_HOSPITALS].map((hospital, index) => (
          <div
            key={index}
            className="group flex w-[260px] shrink-0 flex-col rounded-[2rem] border border-slate-100 bg-white p-3 shadow-xl shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/60 sm:w-[320px] sm:p-4"
          >
            <div className="relative mb-3 h-36 w-full overflow-hidden rounded-2xl bg-slate-100 sm:mb-4 sm:h-48">
              <Image
                src={hospital.image}
                alt={hospital.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-1 flex-col px-2 pb-2">
              <h3 className="mb-2 text-lg leading-tight font-extrabold text-slate-900 sm:mb-4 sm:text-xl">
                {hospital.name}
              </h3>

              <div className="mt-auto flex w-max items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 font-medium text-slate-500">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{hospital.location}</span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>

    {/* Mobile CTA */}
    <div className="container mx-auto mt-8 flex justify-center px-4 md:hidden">
      <Link href="/hospitals" className="w-full">
        <Button
          className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-8 py-6 text-lg font-bold text-white shadow-lg transition-all hover:bg-teal-700"
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
