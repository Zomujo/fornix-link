import { JSX } from 'react';

const PRODUCTS = [
  {
    num: '01',
    title: 'Clinical Decision Support',
    description:
      'Fornix AI analyzes patient history, symptoms, and clinical data in real-time to surface relevant diagnoses, drug interactions, and evidence-based treatment recommendations.',
  },
  {
    num: '02',
    title: 'AI Ambient Conversation Capture',
    description:
      'Fornix AI listens to your consultation and automatically generates structured SOAP notes. Supports Twi, Ewe, Ga, and English.',
  },
  {
    num: '03',
    title: 'Electronic Medical Records',
    description:
      'Manage patient records, prescriptions, lab results, and appointment history in one secure, cloud-based system. Accessible from any device.',
  },
  {
    num: '04',
    title: 'AI Analytics Dashboard',
    description:
      'Real-time dashboards that show appointment trends, revenue analytics, patient demographics, and clinical outcomes.',
  },
  {
    num: '05',
    title: 'Telemedicine Platform',
    description:
      'HD video consultations, secure messaging, and digital follow-ups built directly into your workflow.',
  },
  {
    num: '06',
    title: 'Smart Scheduling and Billing',
    description:
      'Intelligent scheduling that fills gaps, sends automatic reminders, and processes payments via Mobile Money, card, or insurance.',
  },
];

const FornixAiProducts = (): JSX.Element => (
  <section className="bg-slate-50 py-24 md:py-32">
    <div className="container mx-auto px-4 md:px-8 max-w-7xl">
      <div className="mb-20 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Everything your practice needs
        </h2>
        <p className="mt-6 text-xl text-slate-500 leading-relaxed">
          Built specifically for the Ghanaian healthcare context — from solo GPs to multi-specialty
          hospital networks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 max-w-6xl mx-auto">
        {PRODUCTS.map((product) => (
          <div key={product.num} className="flex flex-col">
            <span className="text-sm font-bold tracking-widest text-teal-600 mb-4">
              {product.num} —
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {product.title}
            </h3>
            <p className="text-slate-500 leading-relaxed">
              {product.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FornixAiProducts;
