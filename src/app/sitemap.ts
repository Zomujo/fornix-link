import type { MetadataRoute } from 'next';
import { BRANDING } from '@/constants/branding.constant';
import { IDoctor } from '@/types/doctor.interface';
import { IHospitalListItem } from '@/types/hospital.interface';
import { IPagination } from '@/types/shared.interface';
const BASE_URL = BRANDING.APP_URL;
interface DoctorSitemapData {
  id: string;
  updatedAt: Date;
}

interface HospitalSitemapData {
  slug: string;
}

function safeDate(value: Date | string | undefined): Date {
  const parsed = new Date(value as string);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

async function fetchPublicDoctors(): Promise<DoctorSitemapData[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?pageSize=500&page=1`, {
      next: { revalidate: 86400 },
    });
    if (!response.ok) {
      return [];
    }
    const json = (await response.json()) as { data: IPagination<IDoctor> };
    return json.data.rows.map((doctor) => ({
      id: doctor.id,
      updatedAt: safeDate(doctor.updatedAt),
    }));
  } catch {
    return [];
  }
}

async function fetchPublicHospitals(): Promise<HospitalSitemapData[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/hospitals?pageSize=500&page=1&isActive=true`,
      { next: { revalidate: 86400 } },
    );
    if (!response.ok) {
      return [];
    }
    const json = (await response.json()) as { data: IPagination<IHospitalListItem> };
    return json.data.rows
      .filter((hospital) => hospital.slug)
      .map((hospital) => ({ slug: hospital.slug }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/find-doctors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/find-specialists`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/hospitals`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
  const [doctors, hospitals] = await Promise.all([fetchPublicDoctors(), fetchPublicHospitals()]);
  const doctorRoutes: MetadataRoute.Sitemap = doctors.map((doctor) => ({
    url: `${BASE_URL}/doctor/${doctor.id}`,
    lastModified: doctor.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  const hospitalRoutes: MetadataRoute.Sitemap = hospitals.map((hospital) => ({
    url: `${BASE_URL}/hospitals/${hospital.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  return [...staticRoutes, ...doctorRoutes, ...hospitalRoutes];
}
