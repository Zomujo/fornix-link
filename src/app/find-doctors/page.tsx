import { JSX } from 'react';
import type { Metadata } from 'next';
import PublicDiscoveryPage from '@/components/home/publicDiscoveryPage';
import { buildCanonicalUrl, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

const title = 'Book a Doctor in Ghana';
const description =
  'Book appointments with verified doctors in Ghana by name, specialty, consultation fee, and availability.';
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
  return <PublicDiscoveryPage title="Book a Doctor" description={description} type="doctors" />;
}
