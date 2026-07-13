'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { JSX } from 'react';
import { Loader2 } from 'lucide-react';
import { Navigation } from '@/components/home/navigation';
import Footer from '@/components/home/footer';
import { BRANDING } from '@/constants/branding.constant';

const Doctors = dynamic(() => import('@/app/dashboard/(patient)/find-doctor/_components/doctors'), {
  loading: () => <SectionFallback />,
  ssr: false,
});

const Hospitals = dynamic(
  () => import('@/app/dashboard/(patient)/find-doctor/_components/hospitals'),
  {
    loading: () => <SectionFallback />,
    ssr: false,
  },
);

type PublicDiscoveryPageProps = {
  title: string;
  description: string;
  type: 'doctors' | 'hospitals' | 'specialists';
};

const SectionFallback = (): JSX.Element => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="animate-spin" size={32} />
  </div>
);

const PublicDiscoveryPage = ({
  title,
  description,
  type,
}: PublicDiscoveryPageProps): JSX.Element => (
  <div>
    <header className="flex items-center justify-between border-b bg-white px-4 py-4 md:px-10">
      <Link href="/" className="text-primary text-xl font-bold">
        {BRANDING.APP_NAME}
      </Link>
      <Navigation />
    </header>
    <main className="mx-4 py-8 md:mx-10">
      <section className="mb-6">
        <h1 className="text-2xl font-bold md:text-[32px]">{title}</h1>
        <p className="mt-2 max-w-3xl text-gray-500">{description}</p>
      </section>
      {type === 'hospitals' ? <Hospitals title="Book Hospitals" /> : <Doctors />}
    </main>
    <Footer />
  </div>
);

export default PublicDiscoveryPage;
