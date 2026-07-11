import { JSX } from 'react';
import ProvidersHero from './_components/ProvidersHero';
import FornixAiProducts from './_components/FornixAiProducts';
import ProviderHowItWorks from './_components/ProviderHowItWorks';
import ProviderPricing from './_components/ProviderPricing';
import ProviderCTA from './_components/ProviderCTA';
import Footer from '@/components/home/footer';
import { BRANDING } from '@/constants/branding.constant';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `For Providers — ${BRANDING.APP_NAME}`,
  description:
    'Fornix Link for clinics, hospitals, and independent doctors. AI-powered clinical tools, seamless scheduling, and a growing patient network across Ghana.',
};

export default function ForProvidersPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <ProvidersHero />
      <FornixAiProducts />
      <ProviderHowItWorks />
      <ProviderPricing />
      <ProviderCTA />
      <Footer />
    </div>
  );
}
