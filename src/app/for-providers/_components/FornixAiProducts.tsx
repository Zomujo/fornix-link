'use client';
import Image from 'next/image';
import { JSX, useState } from 'react';
import { GhanaAiAmbient } from '@/assets/images';
import { motion, AnimatePresence } from 'framer-motion';

const PRODUCTS = [
  {
    id: 'clinical-decision',
    tag: 'AI-Powered',
    title: 'Clinical Decision Support',
    subtitle: 'Smarter care, faster decisions',
    description:
      'Fornix AI analyzes patient history, symptoms, and clinical data in real-time to surface relevant diagnoses, drug interactions, and evidence-based treatment recommendations — right when you need them.',
    highlights: [
      'Real-time differential diagnosis assistance',
      'Drug-drug & drug-allergy interaction alerts',
      'Evidence-based treatment guidelines',
      'Integrates with your existing EMR workflow',
    ],
    gradient: 'from-violet-500 to-purple-600',
    badge: 'Reduce diagnostic errors by up to 40%',
  },
  {
    id: 'ambient-capture',
    tag: 'Voice AI',
    title: 'AI Ambient Conversation Capture',
    subtitle: 'Let AI handle the notes',
    description:
      'Fornix AI listens to your consultation, automatically generates structured SOAP notes, and populates your EMR — so you can focus entirely on your patient instead of typing.',
    highlights: [
      'Auto-generated SOAP notes from conversations',
      'Supports Twi, Ewe, Ga, and English',
      'One-click review & sign off',
      'HIPAA & GDPR compliant recording',
    ],
    gradient: 'from-teal-500 to-emerald-600',
    badge: 'Save 2+ hours of documentation per day',
  },
  {
    id: 'emr',
    tag: 'Core Platform',
    title: 'Electronic Medical Records',
    subtitle: 'Your entire practice, digitized',
    description:
      'Manage patient records, prescriptions, lab results, and appointment history in one secure, cloud-based system. Accessible from any device, anywhere in Ghana.',
    highlights: [
      'Complete patient health history',
      'Digital prescriptions with audit trails',
      'Lab result tracking & alerts',
      'Offline access for areas with poor connectivity',
    ],
    gradient: 'from-blue-500 to-indigo-600',
    badge: 'Paperless practice in days',
  },
  {
    id: 'analytics',
    tag: 'Business Intelligence',
    title: 'AI Analytics Dashboard',
    subtitle: 'Know your practice inside out',
    description:
      'Real-time dashboards that show appointment trends, revenue analytics, patient demographics, and clinical outcomes — giving administrators and department heads the intelligence to make data-driven decisions.',
    highlights: [
      'Revenue & appointment trend tracking',
      'Patient retention & satisfaction metrics',
      'Department performance benchmarks',
      'Exportable reports for board presentations',
    ],
    gradient: 'from-orange-500 to-rose-600',
    badge: 'Increase practice revenue by 25%',
  },
  {
    id: 'telemedicine',
    tag: 'Virtual Care',
    title: 'Telemedicine Platform',
    subtitle: 'Care without boundaries',
    description:
      'HD video consultations, secure messaging, and digital follow-ups built directly into your workflow. Reach patients in Tamale, Takoradi, or anywhere in between.',
    highlights: [
      'HD video consultations (browser & mobile)',
      'Secure patient messaging',
      'Virtual waiting room management',
      'Post-consultation follow-up automation',
    ],
    gradient: 'from-cyan-500 to-sky-600',
    badge: 'Expand your reach nationwide',
  },
  {
    id: 'scheduling',
    tag: 'Operations',
    title: 'Smart Scheduling & Billing',
    subtitle: 'Zero missed appointments',
    description:
      'Intelligent scheduling that fills gaps, sends automatic reminders, and processes payments via Mobile Money, card, or insurance — all in one place.',
    highlights: [
      'AI-powered appointment slot optimization',
      'Automated SMS/WhatsApp reminders',
      'Mobile Money & card payment processing',
      'Insurance claim management',
    ],
    gradient: 'from-green-500 to-teal-600',
    badge: 'Reduce no-shows by 60%',
  },
];

const FornixAiProducts = (): JSX.Element => {
  const [activeId, setActiveId] = useState(PRODUCTS[0].id);
  const activeProduct = PRODUCTS.find((p) => p.id === activeId) ?? PRODUCTS[0];

  return (
    <section id="products" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full bg-teal-500/20 px-4 py-1.5 text-sm font-semibold text-teal-300 ring-1 ring-teal-500/30">
            Fornix AI Suite
          </span>
          <h2 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
            Every tool your practice needs,{' '}
            <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
              supercharged with AI
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Built specifically for the Ghanaian healthcare context — from solo GPs to multi-specialty
            hospital networks.
          </p>
        </div>

        {/* Product grid tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {PRODUCTS.map((product) => (
            <button
              key={product.id}
              onClick={() => setActiveId(product.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeId === product.id
                  ? `bg-gradient-to-r ${product.gradient} text-white shadow-lg`
                  : 'border border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {product.title}
            </button>
          ))}
        </div>

        {/* Active product spotlight */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-5xl"
          >
            <div className="flex flex-col gap-8 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 backdrop-blur-sm lg:flex-row lg:items-center lg:gap-12">
              <div className="lg:w-1/2">
                <span
                  className={`mb-3 inline-block rounded-full bg-gradient-to-r ${activeProduct.gradient} px-3 py-1 text-xs font-bold text-white`}
                >
                  {activeProduct.tag}
                </span>
                <h3 className="mb-2 text-3xl font-black text-white">{activeProduct.title}</h3>
                <p className="mb-4 text-lg font-semibold text-teal-300">{activeProduct.subtitle}</p>
                <p className="mb-6 text-slate-400 leading-relaxed">{activeProduct.description}</p>
                <ul className="mb-6 space-y-3">
                  {activeProduct.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-sm text-slate-300">
                      <span
                        className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${activeProduct.gradient} text-white`}
                      >
                        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                <div
                  className={`inline-block rounded-xl bg-gradient-to-r ${activeProduct.gradient} px-4 py-2 text-sm font-bold text-white shadow-lg`}
                >
                  ✦ {activeProduct.badge}
                </div>
              </div>

              <div className="relative lg:w-1/2">
                <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                  <Image
                    src={GhanaAiAmbient}
                    alt="Fornix AI clinical tools in action"
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mini cards below for all products */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {PRODUCTS.map((product) => (
            <button
              key={product.id}
              onClick={() => setActiveId(product.id)}
              className={`group flex flex-col gap-2 rounded-2xl p-4 text-left transition-all duration-200 ${
                activeId === product.id
                  ? 'bg-white/10 ring-1 ring-white/20'
                  : 'bg-white/5 hover:bg-white/8'
              }`}
            >
              <div
                className={`h-8 w-8 rounded-lg bg-gradient-to-br ${product.gradient} flex items-center justify-center`}
              >
                <span className="text-xs font-black text-white">
                  {product.id === 'clinical-decision' && '🧠'}
                  {product.id === 'ambient-capture' && '🎙️'}
                  {product.id === 'emr' && '📋'}
                  {product.id === 'analytics' && '📊'}
                  {product.id === 'telemedicine' && '📹'}
                  {product.id === 'scheduling' && '📅'}
                </span>
              </div>
              <p className="text-xs font-semibold leading-tight text-white">{product.title}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FornixAiProducts;
