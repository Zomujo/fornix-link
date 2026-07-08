import { JSX } from 'react';
import Home from '@/components/home/home';
import type { Metadata } from 'next';
import { BRANDING } from '@/constants/branding.constant';
import { buildOpenGraph, buildTwitterCard, buildCanonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${BRANDING.APP_NAME} | ${BRANDING.SEO_TITLE}`,
  description: BRANDING.OG_DESCRIPTION,
  keywords: [...BRANDING.KEYWORDS],
  alternates: {
    canonical: buildCanonicalUrl('/'),
  },
  openGraph: buildOpenGraph({
    title: `${BRANDING.APP_NAME} | ${BRANDING.SEO_TITLE}`,
    description: BRANDING.OG_DESCRIPTION,
    url: buildCanonicalUrl('/'),
  }),
  twitter: buildTwitterCard({
    title: `${BRANDING.APP_NAME} | ${BRANDING.SEO_TITLE}`,
    description: BRANDING.OG_DESCRIPTION,
  }),
};

export default function HomePage(): JSX.Element {
  return <Home />;
}
