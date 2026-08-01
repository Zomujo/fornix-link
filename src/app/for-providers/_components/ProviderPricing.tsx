import { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const DOCTOR_FEATURES = [
  'Free to join — no monthly subscription',
  'Set your own consultation fees',
  'Unlimited appointments',
  'AI-assisted clinical notes',
  'HD video consultation platform',
  'Instant payment to Mobile Money',
];

const HOSPITAL_FEATURES = [
  'Multi-department management',
  'Full Clinical Decision Support AI suite',
  'AI Analytics Dashboard',
  'Ambient Conversation Capture',
  'EMR integration and patient records',
  'Dedicated account manager',
];

const ProviderPricing = (): JSX.Element => (
  <section className="bg-slate-50 py-24 md:py-32">
    <div className="container mx-auto max-w-5xl px-4 md:px-8">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Simple pricing
        </h2>
        <p className="mt-6 text-xl leading-relaxed text-slate-500">
          Start free, grow at your own pace. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Doctor */}
        <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
          <span className="mb-4 text-sm font-bold tracking-widest text-teal-600">FOR DOCTORS</span>
          <h3 className="mb-2 text-3xl font-extrabold text-slate-900">Free to join</h3>
          <p className="mb-8 text-slate-500">
            Sign up, get verified, and start receiving patients at no cost.
          </p>

          <ul className="mb-10 flex-1 space-y-3">
            {DOCTOR_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/sign-up?role=doctor"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-4 text-base font-bold text-white transition-all hover:bg-teal-500"
          >
            Join as a Doctor <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Hospital */}
        <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
          <span className="mb-4 text-sm font-bold tracking-widest text-teal-600">
            FOR HOSPITALS
          </span>
          <h3 className="mb-2 text-3xl font-extrabold text-slate-900">Enterprise</h3>
          <p className="mb-8 text-slate-500">
            Full-featured platform with Fornix AI suite. Pricing tailored to your institution.
          </p>

          <ul className="mb-10 flex-1 space-y-3">
            {HOSPITAL_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/sign-up?role=hospital"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 text-base font-bold text-slate-900 transition-all hover:border-slate-300"
          >
            Register Your Hospital <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default ProviderPricing;
