import { JSX } from 'react';
import type { Metadata } from 'next';
import PublicDiscoveryPage from '@/components/home/publicDiscoveryPage';
import { BRANDING } from '@/constants/branding.constant';
import { buildCanonicalUrl, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

const title = `Find Doctors in Ghana | ${BRANDING.APP_NAME}`;
const description =
  'Search verified doctors in Ghana by name, specialty, consultation fee, and availability.';
const url = buildCanonicalUrl('/find-doctors');

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: buildOpenGraph({ title, description, url }),
  twitter: buildTwitterCard({ title, description }),
};

export default function FindDoctorsPage(): JSX.Element {
  return (
    <PublicDiscoveryPage
      title="Find Doctors"
      description={description}
      type="doctors"
    />
  );
}
