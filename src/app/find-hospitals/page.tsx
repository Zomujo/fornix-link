import { JSX } from 'react';
import type { Metadata } from 'next';
import PublicDiscoveryPage from '@/components/home/publicDiscoveryPage';
import { BRANDING } from '@/constants/branding.constant';
import { buildCanonicalUrl, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

const title = `Find Hospitals in Ghana | ${BRANDING.APP_NAME}`;
const description =
  'Search hospitals and healthcare facilities in Ghana by location, specialty, and supported insurance.';
const url = buildCanonicalUrl('/find-hospitals');

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: buildOpenGraph({ title, description, url }),
  twitter: buildTwitterCard({ title, description }),
};

export default function FindHospitalsPage(): JSX.Element {
  return (
    <PublicDiscoveryPage
      title="Find Hospitals"
      description={description}
      type="hospitals"
    />
  );
}
