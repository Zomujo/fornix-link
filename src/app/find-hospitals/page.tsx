import { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/home/footer';
import { buildCanonicalUrl, buildOpenGraph, buildTwitterCard } from '@/lib/seo';
import { BRANDING } from '@/constants/branding.constant';
import { IHospitalListItem } from '@/types/hospital.interface';
import { IPagination, IResponse } from '@/types/shared.interface';

const title = 'Book Hospitals in Ghana';
const description =
  'Book hospital appointments and discover healthcare facilities in Ghana by location, specialty, and supported insurance.';
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

async function fetchHospitals(): Promise<IHospitalListItem[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/hospitals?page=1&pageSize=12&isActive=true`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return [];
    }

    const json = (await response.json()) as IResponse<IPagination<IHospitalListItem>>;
    return json.data.rows;
  } catch {
    return [];
  }
}

function formatAddress(hospital: IHospitalListItem): string {
  const address = hospital.primaryAddress;
  if (!address) {
    return 'Ghana';
  }

  return [address.street, address.city, address.state, address.country].filter(Boolean).join(', ');
}

export default async function FindHospitalsPage(): Promise<JSX.Element> {
  const hospitals = await fetchHospitals();

  return (
    <div>
      <header className="flex items-center justify-between border-b bg-white px-4 py-4 md:px-10">
        <Link href="/" className="text-primary text-xl font-bold">
          {BRANDING.APP_NAME}
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/login" className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100">
            Login
          </Link>
          <Link href="/sign-up" className="bg-primary rounded-md px-4 py-2 text-white">
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="mx-4 py-8 md:mx-10">
        <section className="mb-6">
          <h1 className="text-2xl font-bold md:text-[32px]">Book Hospitals</h1>
          <p className="mt-2 max-w-3xl text-gray-500">{description}</p>
        </section>

        {hospitals.length > 0 ? (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {hospitals.map((hospital) => (
              <article key={hospital.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{hospital.name}</h2>
                    <p className="mt-1 text-sm text-gray-500">{formatAddress(hospital)}</p>
                  </div>

                  {hospital.description && (
                    <p className="line-clamp-3 text-sm text-gray-600">{hospital.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 capitalize">
                      {hospital.organizationType}
                    </span>
                    {hospital.hasEmergency && (
                      <span className="rounded-full bg-red-50 px-3 py-1 text-red-700">
                        Emergency care
                      </span>
                    )}
                    {hospital.telemedicine && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                        Telemedicine
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex flex-wrap gap-3 text-sm">
                    {hospital.mainPhone && (
                      <a className="text-primary font-medium" href={`tel:${hospital.mainPhone}`}>
                        Call hospital
                      </a>
                    )}
                    {hospital.website && (
                      <a
                        className="text-primary font-medium"
                        href={hospital.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit website
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold">Hospitals in Ghana</h2>
            <p className="mt-2 max-w-3xl text-gray-500">
              Fornix Link helps patients book hospitals and discover healthcare facilities in Ghana.
              Hospital listings are being updated.
            </p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
