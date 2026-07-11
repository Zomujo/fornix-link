import { Check, ArrowRight } from 'lucide-react';
import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  <section id="pricing" className="relative overflow-hidden py-24">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-teal-50" />

    <div className="container relative z-10 mx-auto px-4">
      <div className="mb-14 text-center">
        <span className="mb-3 inline-block rounded-full bg-teal-100 px-4 py-1.5 text-sm font-semibold text-teal-700">
          Pricing
        </span>
        <h2 className="mb-4 text-4xl font-extrabold text-slate-900 md:text-5xl">
          Simple, transparent pricing
        </h2>
        <p className="mx-auto max-w-xl text-lg text-slate-500">
          No subscription. No hidden fees. Just pay for the care you need.
        </p>
      </div>

      <div className="mx-auto max-w-lg">
        {/* Patient plan card */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-2xl ring-2 ring-teal-200">
          {/* Top gradient bar */}
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-teal-400 to-emerald-500" />

          <div className="mb-6">
            <span className="mb-3 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-700">
              For Patients
            </span>
            <h3 className="mb-1 text-3xl font-black text-slate-900">Pay Per Appointment</h3>
            <p className="text-slate-500">
              Rates are set by your chosen doctor — you only pay when you book.
            </p>
          </div>

          <ul className="mb-8 space-y-3">
            {PATIENT_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>

          <Link href="/sign-up?role=patient">
            <Button
              className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 py-6 text-base font-bold text-white shadow-lg transition-all hover:brightness-110 hover:shadow-xl"
              child="Get Started — It's Free"
            />
          </Link>

          <p className="mt-4 text-center text-xs text-slate-400">
            No credit card required to sign up
          </p>
        </div>
      </div>

      {/* Provider callout */}
      <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white/60 px-6 py-6 text-center shadow-sm backdrop-blur-sm md:mx-auto md:max-w-2xl md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-bold text-slate-900">Are you a doctor, clinic, or hospital?</p>
          <p className="text-sm text-slate-500">
            See tailored plans for providers — including our Fornix AI suite for hospitals.
          </p>
        </div>
        <Link href="/for-providers" className="shrink-0">
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-xl border-teal-300 px-6 py-3 font-semibold text-teal-700 hover:bg-teal-50"
            child={
              <>
                View Provider Plans
                <ArrowRight className="h-4 w-4" />
              </>
            }
          />
        </Link>
      </div>
    </div>
  </section>
);

export default Pricing;
