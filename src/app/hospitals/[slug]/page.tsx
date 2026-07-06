import React, { JSX, Suspense } from 'react';
import HospitalDetailView from '@/components/hospital/HospitalDetailView';
import type { Metadata } from 'next';
import { BRANDING } from '@/constants/branding.constant';
import { buildCanonicalUrl, buildOpenGraph, buildTwitterCard } from '@/lib/seo';
import { IHospitalDetail } from '@/types/hospital.interface';
import { IResponse } from '@/types/shared.interface';

interface HospitalPageProps {
  params: Promise<{ slug: string }>;
}

async function fetchHospital(slug: string): Promise<IHospitalDetail | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hospitals/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return null;
    }
    const json = (await response.json()) as IResponse<IHospitalDetail>;
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: HospitalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hospital = await fetchHospital(slug);

  if (!hospital) {
    return {
      title: 'Hospital Profile',
      description: `Find hospitals and healthcare services on ${BRANDING.APP_NAME}.`,
      robots: { index: false, follow: false },
    };
  }

  const title = hospital.name;
  const serviceNames = hospital.services?.map((s) => s.service.name).slice(0, 5).join(', ');
  const description =
    hospital.description ||
    `View ${hospital.name}${serviceNames ? ` — services include ${serviceNames}` : ''} on ${BRANDING.APP_NAME}.`;
  const url = buildCanonicalUrl(`/hospitals/${slug}`);
  const logoImage = hospital.images?.find((img) => img.type === 'logo');
  const ogImages = logoImage
    ? [{ url: logoImage.url, width: 800, height: 800, alt: hospital.name }]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: buildOpenGraph({ title, description, url, images: ogImages }),
    twitter: buildTwitterCard({
      title,
      description,
      images: logoImage ? [logoImage.url] : undefined,
    }),
  };
}

export default async function PublicHospitalPage({
  params,
}: Readonly<HospitalPageProps>): Promise<JSX.Element> {
  const { slug } = await params;

  if (!slug) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-600">Invalid hospital URL</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="border-t-primary h-10 w-10 animate-spin rounded-full border-4 border-gray-200" />
        </div>
      }
    >
      <HospitalDetailView slug={slug} mode="public" />
    </Suspense>
  );
}
