import { JSX } from 'react';

const DOCTOR_STEPS = [
  {
    step: '01',
    title: 'Sign up and submit credentials',
    description: 'Create your profile, upload your medical licence. Our team verifies within 24-48 hours.',
  },
  {
    step: '02',
    title: 'Set up your practice',
    description: 'Configure your specialty, fees, time slots, and whether you offer in-person, telehealth, or both.',
  },
  {
    step: '03',
    title: 'Get discovered by patients',
    description: 'Your verified profile is listed in our directory. Patients search, read reviews, and book directly.',
  },
  {
    step: '04',
    title: 'See patients, get paid',
    description: 'Conduct consultations with AI-powered notes. Receive payments directly to your Mobile Money or bank account.',
  },
];

const HOSPITAL_STEPS = [
  {
    step: '01',
    title: 'Register your institution',
    description: 'Submit accreditation documents, set up departments and staff roles.',
  },
  {
    step: '02',
    title: 'Onboard your clinical staff',
    description: 'Invite doctors, nurses, and admin staff. Manage roles, access levels, and departments.',
  },
  {
    step: '03',
    title: 'Deploy Fornix AI tools',
    description: 'Activate Clinical Decision Support, Ambient Capture, and Analytics across your wards.',
  },
  {
    step: '04',
    title: 'Go live',
    description: 'Your hospital appears in the directory. Patients can search departments and book appointments directly.',
  },
];

const ProviderHowItWorks = (): JSX.Element => (
  <section className="bg-white py-24 md:py-32">
    <div className="container mx-auto px-4 md:px-8 max-w-7xl">
      <div className="mb-20 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          How it works
        </h2>
        <p className="mt-6 text-xl text-slate-500 leading-relaxed">
          Getting started is simple — whether you&apos;re a solo practitioner or a hospital network.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-6xl mx-auto">
        {/* Doctors */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-10">For doctors</h3>
          <div className="space-y-10">
            {DOCTOR_STEPS.map((s) => (
              <div key={s.step} className="flex gap-5">
                <span className="text-sm font-bold tracking-widest text-teal-600 pt-1 shrink-0">
                  {s.step}
                </span>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h4>
                  <p className="text-slate-500 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hospitals */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-10">For hospitals</h3>
          <div className="space-y-10">
            {HOSPITAL_STEPS.map((s) => (
              <div key={s.step} className="flex gap-5">
                <span className="text-sm font-bold tracking-widest text-teal-600 pt-1 shrink-0">
                  {s.step}
                </span>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h4>
                  <p className="text-slate-500 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ProviderHowItWorks;
