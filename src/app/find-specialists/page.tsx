import { JSX } from 'react';
import type { Metadata } from 'next';
import PublicDiscoveryPage from '@/components/home/publicDiscoveryPage';
import { buildCanonicalUrl, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

const title = 'Book Healthcare Specialists in Ghana';
const description =
  'Book healthcare specialists in Ghana for online consultations, appointments, and specialist care.';
const url = buildCanonicalUrl('/find-specialists');

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: buildOpenGraph({ title, description, url }),
  twitter: buildTwitterCard({ title, description }),
};

export default function FindSpecialistsPage(): JSX.Element {
  return (
    <PublicDiscoveryPage title="Book Specialists" description={description} type="specialists" />
  );
}
