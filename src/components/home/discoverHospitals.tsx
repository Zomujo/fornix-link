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
  HospitalNyaho 
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
            className="group flex w-[320px] shrink-0 flex-col rounded-[2rem] border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/60"
          >
            <div className="relative h-48 w-full mb-4 overflow-hidden rounded-2xl bg-slate-100">
              <Image 
                src={hospital.image} 
                alt={hospital.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>
            <div className="px-2 flex flex-col flex-1 pb-2">
              <h3 className="mb-4 text-xl font-extrabold text-slate-900 leading-tight">
                {hospital.name}
              </h3>
              
              <div className="mt-auto flex items-center gap-2 text-slate-500 font-medium bg-slate-50 rounded-xl px-4 py-2 w-max">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{hospital.location}</span>
              </div>
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
