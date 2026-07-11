'use client';

import { JSX, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type ProviderType = 'doctor' | 'hospital';

const DOCTOR_STEPS = [
  {
    step: '01',
    title: 'Sign Up & Submit Credentials',
    description:
      'Create your profile and upload your medical licence, specializations, and practice details. Our team reviews and verifies within 24–48 hours.',
    gradient: 'from-teal-400 to-emerald-500',
  },
  {
    step: '02',
    title: 'Set Up Your Practice',
    description:
      'Configure your specialty, consultation fees, available time slots, and whether you offer in-person, telehealth, or both.',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    step: '03',
    title: 'Get Discovered by Patients',
    description:
      'Your verified profile is listed in our directory. Patients search, view your reviews, and book directly with you.',
    gradient: 'from-purple-400 to-violet-500',
  },
  {
    step: '04',
    title: 'Conduct Consultations',
    description:
      'See patients in-person or via HD video consultation. Fornix AI takes notes automatically so you can focus on care.',
    gradient: 'from-orange-400 to-rose-500',
  },
  {
    step: '05',
    title: 'Manage Records & Get Paid',
    description:
      'Access full patient histories, issue digital prescriptions, and receive payments directly to your Mobile Money or bank account.',
    gradient: 'from-green-400 to-teal-500',
  },
];

const HOSPITAL_STEPS = [
  {
    step: '01',
    title: 'Admin Registration',
    description:
      'A hospital administrator registers the institution, submits accreditation documents, and sets up departments and staff roles.',
    gradient: 'from-teal-400 to-emerald-500',
  },
  {
    step: '02',
    title: 'Onboard Your Clinical Staff',
    description:
      'Invite doctors, nurses, and admin staff to join under your hospital umbrella. Manage roles, access levels, and departments.',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    step: '03',
    title: 'Deploy Fornix AI Tools',
    description:
      'Activate Clinical Decision Support, Ambient Conversation Capture, and Analytics Dashboard across your wards and departments.',
    gradient: 'from-purple-400 to-violet-500',
  },
  {
    step: '04',
    title: 'Go Live & Accept Patients',
    description:
      'Your hospital appears in the Fornix Link directory. Patients can search, browse departments, and book appointments directly.',
    gradient: 'from-orange-400 to-rose-500',
  },
  {
    step: '05',
    title: 'Monitor & Optimize',
    description:
      'Use the AI Analytics Dashboard to track departmental performance, revenue, patient satisfaction, and clinical outcomes in real time.',
    gradient: 'from-green-400 to-teal-500',
  },
];

const ProviderHowItWorks = (): JSX.Element => {
  const [type, setType] = useState<ProviderType>('doctor');
  const [active, setActive] = useState(0);

  const steps = type === 'doctor' ? DOCTOR_STEPS : HOSPITAL_STEPS;

  const handleTypeChange = (newType: ProviderType): void => {
    setType(newType);
    setActive(0);
  };

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-100 opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-100 opacity-60 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600">
            Provider Onboarding
          </span>
          <h2 className="mb-4 text-4xl font-extrabold text-slate-900 md:text-5xl">
            How it works for{' '}
            <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
              providers
            </span>
          </h2>
          <p className="mx-auto max-w-xl text-lg text-slate-500">
            Getting started on Fornix Link is simple — whether you&apos;re a solo practitioner or a
            hospital network.
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="relative inline-flex rounded-full bg-slate-100 p-1 shadow-inner">
            <motion.div
              className="absolute inset-y-1 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg"
              initial={false}
              layoutId="providerTypeTab"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{
                width: 'calc(50% - 4px)',
                left: type === 'doctor' ? '4px' : 'calc(50% + 0px)',
              }}
            />
            {(['doctor', 'hospital'] as ProviderType[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={cn(
                  'relative z-10 rounded-full px-8 py-3 text-sm font-semibold capitalize transition-colors duration-300',
                  type === t ? 'text-white' : 'text-slate-500 hover:text-slate-900',
                )}
              >
                {t === 'doctor' ? 'Individual Doctors' : 'Hospitals & Clinics'}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-4xl"
          >
            <div className="space-y-3">
              {steps.map((s, index) => (
                <button
                  key={s.step}
                  onClick={() => setActive(index)}
                  className={`flex w-full items-start gap-5 rounded-2xl p-5 text-left transition-all duration-300 ${
                    active === index
                      ? 'bg-gradient-to-r from-teal-50 to-emerald-50 shadow-md ring-1 ring-teal-200'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-lg font-black text-white shadow-lg transition-transform duration-300 ${
                      active === index ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    {s.step}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`mb-1 text-base font-bold ${active === index ? 'text-teal-700' : 'text-slate-800'}`}
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
                  <div
                    className={`shrink-0 text-xs font-semibold ${active === index ? 'text-teal-500' : 'text-slate-300'}`}
                  >
                    Step {index + 1}/{steps.length}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProviderHowItWorks;
