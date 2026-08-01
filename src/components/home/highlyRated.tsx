'use client';

import { JSX, useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import DiscoverHospitals from './discoverHospitals';
import { useAppDispatch } from '@/lib/hooks';
import { getAllDoctors } from '@/lib/features/doctors/doctorsThunk';
import { AcceptDeclineStatus, OrderDirection } from '@/types/shared.enum';
import { IDoctor } from '@/types/doctor.interface';
import { IPagination } from '@/types/shared.interface';
import { AvatarComp } from '@/components/ui/avatar';

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
  imageSrc?: string;
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
    imageSrc: doctor.profilePicture,
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
          pageSize: 15, // Increased to fetch enough doctors for the marquee
          status: AcceptDeclineStatus.Accepted,
          booking: true, // Only doctors with available slots
          orderBy: 'rate',
          orderDirection: OrderDirection.Descending,
        }),
      );

      if (!payload || typeof payload !== 'object' || !('rows' in payload)) {
        setIsLoading(false);
        return;
      }

      const doctorPayload = payload as IPagination<IDoctor>;
      setProviders((doctorPayload.rows ?? []).map(mapDoctorToCard));
      setIsLoading(false);
    }

    void fetchHighlyRatedDoctors();
  }, [dispatch]);

  // For the infinite marquee to work smoothly, we duplicate the array
  const duplicatedProviders = [...providers, ...providers, ...providers];

  return (
    <>
      <section className="overflow-hidden bg-slate-50 py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="mb-4 inline-block rounded-full bg-teal-50 px-4 py-1.5 text-sm font-bold tracking-wide text-teal-700">
                Top Rated Specialists
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Highly rated, ready to see you
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                Top-rated providers with real availability — book directly, no waiting.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="container mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex gap-6 overflow-hidden">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`provider-skeleton-${index}`}
                  className="flex w-[320px] shrink-0 flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-5">
                    <div className="mb-3 h-6 w-20 animate-pulse rounded-full bg-slate-200" />
                    <div className="mb-4 flex items-center gap-4">
                      <div className="h-16 w-16 animate-pulse rounded-full bg-slate-200" />
                      <div>
                        <div className="mb-2 h-5 w-32 animate-pulse rounded bg-slate-200" />
                        <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 h-5 w-24 animate-pulse rounded bg-slate-100" />
                  <div className="mb-3 h-5 w-32 animate-pulse rounded bg-slate-100" />
                  <div className="mb-6 h-5 w-48 animate-pulse rounded bg-slate-100" />
                  <div className="mt-auto h-12 animate-pulse rounded-xl bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        ) : providers.length > 0 ? (
          <div className="group relative flex overflow-hidden pb-8">
            {/* Fade edges */}
            <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r from-slate-50 to-transparent md:w-64"></div>
            <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24 bg-gradient-to-l from-slate-50 to-transparent md:w-64"></div>

            <motion.div
              drag="x"
              dragConstraints={{ left: -2000, right: 0 }}
              whileDrag={{ cursor: 'grabbing' }}
              animate={{ x: [-1920, 0] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 60,
                  ease: 'linear',
                },
              }}
              className="flex w-max cursor-grab gap-6 px-6 active:cursor-grabbing"
            >
              {duplicatedProviders.map((provider, index) => (
                <div
                  key={`${provider.id}-${index}`}
                  className={`flex w-[260px] shrink-0 flex-col items-center rounded-[2rem] border p-4 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:w-[360px] sm:p-6 ${provider.accentColor}`}
                >
                  <div className="mt-2 mb-4">
                    <AvatarComp
                      name={provider.name}
                      imageSrc={provider.imageSrc}
                      className="mx-auto h-20 w-20 border-4 border-white shadow-md sm:h-28 sm:w-28"
                    />
                  </div>

                  <h3 className="mb-1 text-lg leading-tight font-extrabold text-slate-900 sm:text-xl">
                    {provider.name}
                  </h3>
                  <p className="mb-4 text-xs font-medium text-slate-600 sm:text-sm">
                    {provider.type}
                  </p>

                  <div className="mb-4 flex items-center justify-center gap-1">
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

                  <div className="mb-3 flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-600">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="truncate">{provider.location}</span>
                  </div>

                  <div className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white/60 p-2.5 text-sm font-bold text-teal-600">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span className="truncate">{provider.availability}</span>
                  </div>

                  <div className="mt-auto w-full">
                    <Link
                      href={provider.href}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm ring-1 ring-slate-200 transition-all hover:text-teal-700 hover:shadow hover:ring-teal-400"
                    >
                      Book Now <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-10 text-center">
            <p className="text-lg text-slate-500">No available doctors found at the moment.</p>
          </div>
        )}
      </section>

      <DiscoverHospitals />
    </>
  );
};

export default HighlyRated;
