import React, { JSX, Suspense } from 'react';
import type { Metadata } from 'next';
import { buildCanonicalUrl, buildOpenGraph, buildTwitterCard } from '@/lib/seo';
import HospitalListView from '@/components/hospital/HospitalListView';

const title = 'Find Hospitals in Ghana';
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
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="border-t-primary h-10 w-10 animate-spin rounded-full border-4 border-gray-200" />
        </div>
      }
    >
      <HospitalListView mode="public" />
    </Suspense>
  );
}
