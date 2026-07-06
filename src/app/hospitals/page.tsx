import React, { JSX, Suspense } from 'react';
import HospitalListView from '@/components/hospital/HospitalListView';
import type { Metadata } from 'next';
import { BRANDING } from '@/constants/branding.constant';
import { buildCanonicalUrl, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Find Hospitals',
  description: `Browse hospitals and healthcare services on ${BRANDING.APP_NAME}.`,
  alternates: { canonical: buildCanonicalUrl('/hospitals') },
  openGraph: buildOpenGraph({
    title: 'Find Hospitals',
    description: `Browse hospitals and healthcare services on ${BRANDING.APP_NAME}.`,
    url: buildCanonicalUrl('/hospitals'),
  }),
  twitter: buildTwitterCard({
    title: 'Find Hospitals',
    description: `Browse hospitals and healthcare services on ${BRANDING.APP_NAME}.`,
  }),
};

const HospitalsPage = (): JSX.Element => (
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

export default HospitalsPage;
