'use client';
import { JSX, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Phone, MicOff } from 'lucide-react';

const STEPS = [
  {
    step: '1',
    title: 'Create Account',
    description: "Sign up in under 2 minutes. Verify your email and you're ready to go.",
    color: 'from-pink-400 to-rose-400',
    shadow: 'shadow-pink-200',
  },
  {
    step: '2',
    title: 'Find Doctor/Hospital',
    description: 'Browse verified specialists by specialty or location. Read real reviews.',
    color: 'from-violet-400 to-purple-500',
    shadow: 'shadow-violet-200',
  },
  {
    step: '3',
    title: 'Book & Pay',
    description: "Pick a time slot, pay securely via Mobile Money or card, and you're confirmed.",
    color: 'from-teal-400 to-emerald-400',
    shadow: 'shadow-teal-200',
  },
  {
    step: '4',
    title: 'See Doctor',
    description: 'Attend in person or join an HD video consultation easily.',
    color: 'from-amber-400 to-orange-400',
    shadow: 'shadow-amber-200',
  },
  {
    step: '5',
    title: 'Your Records',
    description: 'View prescriptions, lab results, and your full history anytime.',
    color: 'from-blue-400 to-cyan-500',
    shadow: 'shadow-blue-200',
  },
];

// Mockup components for the phone screen
const MockupSignup = (): JSX.Element => (
  <div className="flex h-full w-full flex-col bg-white p-6">
    <div className="mb-6 flex justify-center pt-8">
      <div className="h-10 w-10 rounded-2xl bg-pink-400"></div>
    </div>
    <div className="space-y-4">
      <div className="h-12 w-full rounded-2xl bg-slate-100 p-4"></div>
      <div className="h-12 w-full rounded-2xl bg-slate-100 p-4"></div>
      <div className="mt-6 h-14 w-full rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 shadow-lg shadow-pink-200"></div>
    </div>
  </div>
);

const MockupSearch = (): JSX.Element => (
  <div className="flex h-full w-full flex-col bg-slate-50 p-4 pt-8">
    <div className="mb-4 flex h-12 w-full shrink-0 items-center gap-3 rounded-full bg-white px-4 shadow-sm">
      <Search className="h-5 w-5 text-slate-300" />
      <div className="h-2 w-24 rounded bg-slate-200"></div>
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm">
          <div className="h-12 w-12 shrink-0 rounded-full bg-violet-100"></div>
          <div className="flex-1">
            <div className="mb-2 h-2.5 w-20 rounded bg-slate-700"></div>
            <div className="h-2 w-12 rounded bg-slate-300"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MockupBook = (): JSX.Element => (
  <div className="flex h-full w-full flex-col bg-white p-5 pt-8">
    <div className="mb-6 flex shrink-0 items-center gap-4 border-b border-slate-100 pb-4">
      <div className="h-14 w-14 rounded-full bg-teal-100"></div>
      <div>
        <div className="mb-2 h-3 w-24 rounded bg-slate-800"></div>
        <div className="h-2 w-16 rounded bg-slate-400"></div>
      </div>
    </div>
    <div className="mb-6 grid shrink-0 grid-cols-3 gap-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className={`h-10 rounded-xl ${i === 2 ? 'bg-teal-400' : 'bg-slate-100'}`}
        ></div>
      ))}
    </div>
    <div className="mt-auto h-14 w-full shrink-0 rounded-2xl bg-slate-900 shadow-xl"></div>
  </div>
);

const MockupVideo = (): JSX.Element => (
  <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-900">
    <div className="absolute inset-0 bg-slate-800">
      <div className="absolute bottom-0 left-1/2 h-64 w-48 -translate-x-1/2 rounded-t-[4rem] bg-slate-700"></div>
    </div>
    <div className="absolute top-6 right-4 h-32 w-24 overflow-hidden rounded-2xl border-2 border-white/10 bg-slate-900"></div>
    <div className="absolute bottom-8 left-1/2 flex w-full -translate-x-1/2 justify-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
        <MicOff className="h-5 w-5 text-white" />
      </div>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 shadow-lg shadow-rose-500/30">
        <Phone className="h-6 w-6 rotate-[135deg] text-white" />
      </div>
    </div>
  </div>
);

const MockupRecords = (): JSX.Element => (
  <div className="flex h-full w-full flex-col bg-slate-50 p-5 pt-8">
    <div className="space-y-3">
      {[
        { bg: 'bg-blue-100', color: 'text-blue-500' },
        { bg: 'bg-cyan-100', color: 'text-cyan-500' },
        { bg: 'bg-blue-100', color: 'text-blue-500' },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.bg}`}
          >
            <FileText className={`h-5 w-5 ${item.color}`} />
          </div>
          <div className="flex-1">
            <div className="mb-2 h-2.5 w-24 rounded bg-slate-700"></div>
            <div className="h-2 w-16 rounded bg-slate-300"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MOCKUPS = [MockupSignup, MockupSearch, MockupBook, MockupVideo, MockupRecords];

const HowItWorks = (): JSX.Element => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % STEPS.length);
    }, 4000);
    return (): void => clearInterval(timer);
  }, []);

  const ActiveMockup = MOCKUPS[active] || MOCKUPS[0];
  const activeStep = STEPS[active];

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      <div className="relative z-10 container mx-auto max-w-5xl px-4 text-center">
        <div className="mb-12">
          <span className="mb-4 inline-block rounded-full bg-teal-50 px-4 py-1.5 text-sm font-bold tracking-wide text-teal-700">
            How It Works
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            From search to care in{' '}
            <span className="relative inline-block">
              5 simple steps
              <svg
                viewBox="0 0 300 12"
                className="absolute -bottom-2 left-0 w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 Q75 2 150 8 Q225 14 298 6"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
        </div>

        {/* Playful Horizontal Nav */}
        <div className="mb-12 flex flex-wrap justify-center gap-3 md:gap-4">
          {STEPS.map((s, index) => {
            const isActive = active === index;
            return (
              <button
                key={s.step}
                onClick={() => setActive(index)}
                className={`relative flex items-center justify-center rounded-full px-5 py-3 transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${s.color} text-white shadow-lg ${s.shadow} scale-105 font-bold`
                    : 'bg-slate-100 font-medium text-slate-500 hover:bg-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="bubbleIndicator"
                    className="absolute inset-0 rounded-full bg-white/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">
                  {s.step}. {s.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Stage area - Compact & Playful */}
        <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center rounded-[3rem] bg-slate-50 p-8 shadow-inner sm:p-12 md:flex-row md:justify-between">
          {/* Dynamic Content Left */}
          <div className="mb-10 w-full text-center md:mb-0 md:w-1/2 md:pr-10 md:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: -20, rotate: -2 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: 20, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div
                  className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${activeStep.color} text-3xl font-black text-white shadow-xl ${activeStep.shadow} rotate-3`}
                >
                  {activeStep.step}
                </div>
                <h3 className="mb-4 text-3xl font-extrabold text-slate-900">{activeStep.title}</h3>
                <p className="text-lg leading-relaxed text-slate-500">{activeStep.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dynamic Phone Right */}
          <div className="relative flex justify-center md:w-1/2">
            <div className="relative h-[480px] w-[240px] shrink-0 sm:h-[520px] sm:w-[260px]">
              {/* Phone Frame - FIXED BLACK SCREEN ISSUE by removing bg-slate-900 */}
              <div className="pointer-events-none absolute inset-0 z-20 rounded-[3rem] border-[12px] border-slate-900 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 z-30 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-slate-900"></div>
              </div>

              {/* Phone Content Screen */}
              <div className="absolute inset-[6px] z-10 flex flex-col overflow-hidden rounded-[2.5rem] bg-white">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-full w-full flex-col"
                  >
                    <ActiveMockup />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Playful Floating Blob behind phone */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                  animate={{ opacity: 0.2, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute top-1/2 -right-8 -z-10 h-64 w-64 -translate-y-1/2 rounded-full bg-gradient-to-tr ${activeStep.color} blur-2xl`}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
