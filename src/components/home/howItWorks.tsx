'use client';

import Image from 'next/image';
import { JSX, useState } from 'react';
import { GhanaPatientHero } from '@/assets/images';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  {
    step: '01',
    title: 'Create Your Account',
    description: 'Sign up in under 2 minutes. Verify your email and you\'re ready to go.',
    color: 'from-teal-400 to-emerald-500',
  },
  {
    step: '02',
    title: 'Find Your Doctor',
    description: 'Browse verified specialists by specialty, location, or availability. Read real patient reviews.',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    step: '03',
    title: 'Book & Pay Instantly',
    description: 'Pick a time slot that works for you, pay securely via Mobile Money or card, and you\'re confirmed.',
    color: 'from-purple-400 to-violet-500',
  },
  {
    step: '04',
    title: 'See Your Doctor',
    description: 'Attend in person or join a HD video consultation — whichever works best for you.',
    color: 'from-orange-400 to-rose-500',
  },
  {
    step: '05',
    title: 'Access Your Records',
    description: 'View prescriptions, lab results, and your full medical history anytime, anywhere.',
    color: 'from-green-400 to-teal-500',
  },
];

const HowItWorks = (): JSX.Element => {
  const [active, setActive] = useState(0);

  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Subtle background blobs */}
      <div className="pointer-events-none absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-100 opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-100 opacity-50 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block rounded-full bg-teal-100 px-4 py-1.5 text-sm font-semibold text-teal-700">
            Patient Journey
          </span>
          <h2 className="mb-4 text-4xl font-extrabold text-slate-900 md:text-5xl">
            From search to care in{' '}
            <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
              5 simple steps
            </span>
          </h2>
          <p className="mx-auto max-w-xl text-lg text-slate-500">
            Getting the care you deserve has never been easier.
          </p>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Steps list */}
          <div className="flex flex-col gap-3 lg:w-1/2">
            {STEPS.map((s, index) => (
              <button
                key={s.step}
                onClick={() => setActive(index)}
                className={`group flex items-start gap-4 rounded-2xl p-4 text-left transition-all duration-300 ${
                  active === index
                    ? 'bg-gradient-to-r from-teal-50 to-emerald-50 shadow-md ring-1 ring-teal-200'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-lg font-black text-white shadow-lg transition-transform duration-300 ${active === index ? 'scale-110' : 'group-hover:scale-105'}`}
                >
                  {s.step}
                </div>
                <div>
                  <h3
                    className={`mb-1 text-base font-bold transition-colors ${active === index ? 'text-teal-700' : 'text-slate-800'}`}
                  >
                    {s.title}
                  </h3>
                  <AnimatePresence>
                    {active === index && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-sm leading-relaxed text-slate-500"
                      >
                        {s.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            ))}
          </div>

          {/* Image panel */}
          <div className="relative lg:w-1/2">
            <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200">
              <Image
                src={GhanaPatientHero}
                alt="Patient using Fornix Link to book a doctor in Ghana"
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 text-xl font-black text-white">
                ✓
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Appointment Confirmed</p>
                <p className="text-xs text-slate-500">Dr. Asante • Tomorrow 10:00 AM</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
