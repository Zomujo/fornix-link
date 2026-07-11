import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { JSX } from 'react';
import { Button } from '@/components/ui/button';

const DOCTOR_FEATURES = [
  'Free to join — no monthly subscription',
  'Set your own consultation fees',
  'Unlimited appointments',
  'AI-assisted clinical notes (Ambient Capture)',
  'Patient management dashboard',
  'HD video consultation platform',
  'Digital prescription system',
  'Instant payment to Mobile Money',
];

const HOSPITAL_FEATURES = [
  'Multi-department management',
  'Full Clinical Decision Support AI suite',
  'AI Analytics Dashboard for administrators',
  'Ambient Conversation Capture across all departments',
  'EMR integration & patient record management',
  'Insurance claim management',
  'Staff roles & access control',
  'Dedicated account manager',
];

const ProviderPricing = (): JSX.Element => (
  <section
    id="provider-pricing"
    className="relative overflow-hidden py-24"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-teal-50" />

    <div className="container relative z-10 mx-auto px-4">
      <div className="mb-14 text-center">
        <span className="mb-3 inline-block rounded-full bg-teal-100 px-4 py-1.5 text-sm font-semibold text-teal-700">
          Provider Pricing
        </span>
        <h2 className="mb-4 text-4xl font-extrabold text-slate-900 md:text-5xl">
          Simple plans for every provider
        </h2>
        <p className="mx-auto max-w-xl text-lg text-slate-500">
          Start free, grow at your own pace. No hidden fees.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Doctor Plan */}
        <div className="flex flex-col rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <div className="absolute-top-bar mb-2 h-1.5 w-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 -mx-0" />
          <span className="mb-4 inline-block self-start rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-700">
            For Doctors
          </span>
          <h3 className="mb-1 text-3xl font-black text-slate-900">Free to Join</h3>
          <p className="mb-6 text-slate-500">
            Sign up, get verified, and start receiving patients at no cost.
          </p>

          <ul className="mb-8 flex-1 space-y-3">
            {DOCTOR_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>

          <Link href="/sign-up?role=doctor">
            <Button
              className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 py-6 font-bold text-white shadow-md hover:brightness-110"
              child={
                <>
                  Join as a Doctor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              }
            />
          </Link>
        </div>

        {/* Hospital Plan */}
        <div className="relative flex flex-col overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-2xl ring-1 ring-white/10">
          {/* Top gradient accent */}
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-teal-400 via-emerald-500 to-cyan-400" />
          <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 rounded-full bg-teal-500 opacity-10 blur-2xl" />

          <span className="mb-4 inline-block self-start rounded-full bg-teal-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-300 ring-1 ring-teal-500/30">
            For Hospitals & Clinics
          </span>
          <h3 className="mb-1 text-3xl font-black text-white">Enterprise</h3>
          <p className="mb-2 text-slate-400">
            Full-featured platform with Fornix AI suite. Pricing tailored to your institution size.
          </p>
          <p className="mb-6 text-sm font-semibold text-teal-400">
            Contact us for a custom quote →
          </p>

          <ul className="mb-8 flex-1 space-y-3">
            {HOSPITAL_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>

          <Link href="/sign-up?role=hospital">
            <Button
              className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 py-6 font-bold text-white shadow-lg hover:brightness-110"
              child={
                <>
                  Register Your Hospital
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              }
            />
          </Link>
          <p className="mt-3 text-center text-xs text-slate-600">
            Free pilot available for qualifying institutions
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default ProviderPricing;
