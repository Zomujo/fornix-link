'use client';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PATIENT_FEATURES = [
  'Book appointments with any verified doctor',
  'Access your full medical records anytime',
  'Virtual and in-person consultations',
  'Secure payment via Mobile Money or card',
  'Instant booking confirmations',
  '24/7 platform access',
  'Digital prescriptions & lab results',
];

const Pricing = (): JSX.Element => (
  <section id="pricing" className="relative overflow-hidden bg-slate-50 py-32">
    {/* Whimsical Background Elements */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-pink-300/30 blur-[120px]" />
      <div className="absolute top-1/2 right-0 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-teal-300/30 blur-[120px]" />
      <div className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-yellow-300/30 blur-[120px]" />
      
      {/* Floating playful shapes (CSS drawn) */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[15%] h-12 w-12 rounded-full bg-yellow-400 opacity-80"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 left-[10%] h-16 w-16 rounded-3xl bg-pink-400 opacity-70 rotate-12"
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-[5%] h-8 w-8 rounded-full bg-teal-400 opacity-60"
      />
    </div>

    <div className="container relative z-10 mx-auto px-4 max-w-6xl">
      <div className="mb-20 text-center">

        <h2 className="mb-6 text-4xl font-extrabold text-slate-900 sm:text-5xl md:text-6xl tracking-tight">
          Simple, playful pricing.
        </h2>
        <p className="mx-auto max-w-2xl text-xl text-slate-600 font-medium">
          No subscriptions. No hidden fees. <br className="hidden sm:block" />
          Just pay for the care you need, when you need it.
        </p>
      </div>

      {/* Playful Ticket Card */}
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="mx-auto max-w-4xl"
      >
        <div className="group relative overflow-hidden rounded-[3rem] bg-white p-2 shadow-2xl shadow-teal-500/10 border border-slate-100">
          
          <div className="relative flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
            {/* Left Side: The "Price" */}
            <div className="relative p-12 md:p-16 md:w-5/12 flex flex-col justify-center items-center text-center bg-teal-500 overflow-hidden">
              {/* Fun background rays inside the left card */}
              <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                 <div className="w-[800px] h-[800px] bg-[conic-gradient(from_0deg,transparent_0_15deg,white_15deg_30deg,transparent_30deg_45deg,white_45deg_60deg,transparent_60deg_75deg,white_75deg_90deg,transparent_90deg_105deg,white_105deg_120deg,transparent_120deg_135deg,white_135deg_150deg,transparent_150deg_165deg,white_165deg_180deg,transparent_180deg_195deg,white_195deg_210deg,transparent_210deg_225deg,white_225deg_240deg,transparent_240deg_255deg,white_255deg_270deg,transparent_270deg_285deg,white_285deg_300deg,transparent_300deg_315deg,white_315deg_330deg,transparent_330deg_345deg,white_345deg_360deg)] animate-[spin_60s_linear_infinite]"></div>
              </div>

              <div className="relative z-10">
                <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-sm mb-6 border border-white/30">
                  For Patients
                </span>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-white/90">GH₵</span>
                  <span className="text-8xl font-black text-white tracking-tighter">0</span>
                </div>
                <p className="text-2xl font-bold text-white mb-2">Platform Fee</p>
                <p className="text-teal-100 font-medium">You only pay the doctor's set rate.</p>
              </div>

              {/* Decorative zigzag divider on desktop */}
              <div className="hidden md:block absolute right-0 top-0 bottom-0 w-8 translate-x-1/2">
                <svg width="100%" height="100%" preserveAspectRatio="none">
                  <path d="M16 0 L32 16 L16 32 L32 48 L16 64 L32 80 L16 96 L32 112 L16 128 L32 144 L16 160 L32 176 L16 192 L32 208 L16 224 L32 240 L16 256 L32 272 L16 288 L32 304 L16 320 L32 336 L16 352 L32 368 L16 384 L32 400 L16 416 L32 432 L16 448 L32 464 L16 480 L32 496 L16 512 L32 528 L16 544 L32 560 L16 576 L32 592 L16 608 L32 624 L16 640 L32 656 L16 672 L32 688 L16 704 L32 720 L16 736 L32 752 L16 768 L32 784 L16 800" stroke="none" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {/* Right Side: Features */}
            <div className="relative p-10 md:p-16 md:w-7/12 flex flex-col justify-center bg-white z-10">
              <h3 className="mb-8 text-2xl font-bold text-slate-900">Everything you need, included:</h3>
              
              <ul className="mb-10 space-y-4">
                {PATIENT_FEATURES.map((feature, i) => (
                  <motion.li 
                    key={feature} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 text-slate-600 font-medium"
                  >
                    <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Link href="/sign-up?role=patient" className="mt-auto">
                <Button
                  className="w-full rounded-2xl bg-slate-900 py-7 text-lg font-extrabold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-slate-800"
                  child="Create Free Account"
                />
              </Link>
            </div>
            
          </div>
        </div>
      </motion.div>

      {/* Whimsical Provider Callout */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-16 flex justify-center"
      >
        <Link href="/for-providers" className="group relative inline-flex items-center gap-6 rounded-[2rem] bg-white p-4 pr-6 shadow-xl shadow-slate-200/50 border border-slate-100 transition-transform hover:-translate-y-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl group-hover:scale-110 transition-transform duration-300">
            🏥
          </div>
          <div>
            <p className="font-extrabold text-slate-900 text-lg">Are you a healthcare provider?</p>
            <p className="text-sm font-medium text-slate-500">
              See tailored plans for doctors, clinics, and hospitals.
            </p>
          </div>
          <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-transform group-hover:translate-x-2">
            <ArrowRight className="h-5 w-5" />
          </div>
        </Link>
      </motion.div>
      
    </div>
  </section>
);

export default Pricing;
