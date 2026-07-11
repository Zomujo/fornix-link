import { Calendar, CreditCard, MessageSquare, Shield, FileText, Search } from 'lucide-react';
import { JSX } from 'react';

const FEATURES = [
  {
    icon: Search,
    title: 'Find the Right Specialist',
    description: 'Search by specialty, location, or name. Get verified profiles with real patient reviews.',
    color: 'from-teal-400 to-emerald-500',
    bg: 'bg-teal-50',
  },
  {
    icon: Calendar,
    title: 'Book in Seconds',
    description: 'Sync appointments with your calendar and get automatic SMS/email reminders.',
    color: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50',
  },
  {
    icon: MessageSquare,
    title: 'Telehealth from Anywhere',
    description: 'HD video consultations that bring quality care to you — anytime, anywhere in Ghana.',
    color: 'from-purple-400 to-violet-500',
    bg: 'bg-purple-50',
  },
  {
    icon: CreditCard,
    title: 'Simple & Secure Payments',
    description: 'Mobile Money, card, or bank transfer. Streamlined billing with instant confirmations.',
    color: 'from-orange-400 to-rose-500',
    bg: 'bg-orange-50',
  },
  {
    icon: Shield,
    title: 'Your Records, Your Control',
    description: 'Securely store your entire medical history and share it only with who you choose.',
    color: 'from-green-400 to-teal-500',
    bg: 'bg-green-50',
  },
  {
    icon: FileText,
    title: 'Digital Prescriptions',
    description: 'Receive and track prescriptions digitally. No more lost paper slips.',
    color: 'from-pink-400 to-rose-500',
    bg: 'bg-pink-50',
  },
];

const AvailableFeatures = (): JSX.Element => (
  <section id="features" className="relative overflow-hidden py-24">
    {/* Bold gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900" />
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />

    <div className="container relative z-10 mx-auto px-4">
      <div className="mb-14 text-center">
        <span className="mb-3 inline-block rounded-full bg-teal-500/20 px-4 py-1.5 text-sm font-semibold text-teal-300 ring-1 ring-teal-500/30">
          Everything You Need
        </span>
        <h2 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
          Healthcare, built around{' '}
          <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
            you
          </span>
        </h2>
        <p className="mx-auto max-w-xl text-lg text-slate-400">
          Everything you need to manage your healthcare journey — all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ description, icon: Icon, title, color, bg }) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-2xl hover:ring-white/20"
          >
            <div
              className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{description}</p>
            {/* Hover glow */}
            <div
              className={`pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-gradient-to-br ${color} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AvailableFeatures;
