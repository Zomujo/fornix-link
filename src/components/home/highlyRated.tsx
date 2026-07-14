'use client';

import { JSX, useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import DiscoverHospitals from './discoverHospitals';
import { useAppDispatch } from '@/lib/hooks';
import { getAllDoctors } from '@/lib/features/doctors/doctorsThunk';
import { AcceptDeclineStatus, OrderDirection } from '@/types/shared.enum';
import { IDoctor } from '@/types/doctor.interface';
import { IPagination } from '@/types/shared.interface';

type ProviderCard = {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  availability: string;
  href: string;
  accentColor: string;
  badge: string;
  badgeColor: string;
};

const CARD_STYLES = [
  {
    accentColor: 'bg-teal-50 border-teal-100',
    badgeColor: 'bg-teal-100 text-teal-700',
  },
  {
    accentColor: 'bg-blue-50 border-blue-100',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    accentColor: 'bg-purple-50 border-purple-100',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
] as const;

const formatAvailability = (doctor: IDoctor): string => {
  const nextSlot = doctor.appointmentSlots?.[0];

  if (!nextSlot) {
    return 'Booking available now';
  }

  const slotDate = new Date(nextSlot.date);
  const today = new Date();

  const isSameDay =
    slotDate.getFullYear() === today.getFullYear() &&
    slotDate.getMonth() === today.getMonth() &&
    slotDate.getDate() === today.getDate();

  const formattedDay = isSameDay
    ? 'today'
    : slotDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

  const formattedTime = new Date(nextSlot.startTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `Next available: ${formattedDay}, ${formattedTime.toLowerCase()}`;
};

const mapDoctorToCard = (doctor: IDoctor, index: number): ProviderCard => {
  const cardStyle = CARD_STYLES[index % CARD_STYLES.length];

  return {
    id: doctor.id,
    name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
    type: doctor.specializations?.[0] || 'General practice',
    location: doctor.city || 'Ghana',
    rating: doctor.rate,
    availability: formatAvailability(doctor),
    href: `/doctor/${doctor.id}`,
    accentColor: cardStyle.accentColor,
    badge: 'Doctor',
    badgeColor: cardStyle.badgeColor,
  };
};

const HighlyRated = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [providers, setProviders] = useState<ProviderCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHighlyRatedDoctors(): Promise<void> {
      setIsLoading(true);
      const { payload } = await dispatch(
        getAllDoctors({
          page: 1,
          pageSize: 3,
          status: AcceptDeclineStatus.Accepted,
          booking: true,
          orderBy: 'rate',
          orderDirection: OrderDirection.Descending,
        }),
      );

      if (!payload || !('rows' in payload)) {
        setIsLoading(false);
        return;
      }

      const doctorPayload = payload as IPagination<IDoctor>;
      setProviders((doctorPayload.rows ?? []).map(mapDoctorToCard));
      setIsLoading(false);
    }

    void fetchHighlyRatedDoctors();
  }, [dispatch]);

  return (
    <>
      <section className="bg-slate-50 py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Highly rated, ready to see you
            </h2>
            <p className="mt-4 max-w-xl text-lg text-slate-500">
              Top-rated providers with real availability — book directly, no waiting.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`provider-skeleton-${index}`}
                    className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-5">
                      <div className="mb-3 h-6 w-20 animate-pulse rounded-full bg-slate-200" />
                      <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
                      <div className="mt-2 h-4 w-28 animate-pulse rounded bg-slate-100" />
                    </div>
                    <div className="mb-4 h-5 w-24 animate-pulse rounded bg-slate-100" />
                    <div className="mb-3 h-5 w-20 animate-pulse rounded bg-slate-100" />
                    <div className="mb-6 h-5 w-40 animate-pulse rounded bg-slate-100" />
                    <div className="mt-auto h-12 animate-pulse rounded-xl bg-slate-100" />
                  </div>
                ))
              : providers.map((provider) => (
              <div
                key={provider.id}
                className={`flex flex-col rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${provider.accentColor}`}
              >
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <span
                      className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${provider.badgeColor}`}
                    >
                      {provider.badge}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900">{provider.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{provider.type}</p>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(provider.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-semibold text-slate-700">
                    {provider.rating.toFixed(1)}
                  </span>
                </div>

                <div className="mb-3 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{provider.location}</span>
                </div>

                <div className="mb-6 flex items-center gap-1.5 text-sm font-medium text-teal-600">
                  <Clock className="h-4 w-4" />
                  <span>{provider.availability}</span>
                </div>

                <div className="mt-auto">
                  <Link
                    href={provider.href}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm ring-1 ring-slate-200 transition-all hover:text-teal-700 hover:ring-teal-400"
                  >
                    Book Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
                ))}
          </div>
        </div>
      </section>

      <DiscoverHospitals />
    </>
  );
};

export default HighlyRated;
