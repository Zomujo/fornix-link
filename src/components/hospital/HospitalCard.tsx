'use client';

import { MapPin, MoreVertical, Clock, Globe, BedDouble } from 'lucide-react';
import Image from 'next/image';
import React, { JSX, useState } from 'react';
import { IHospitalListItem } from '@/types/hospital.interface';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/assets/images';
import { useAppDispatch } from '@/lib/hooks';
import { createHospitalAppointment } from '@/lib/features/hospital-appointments/hospitalAppointmentsThunk';
import { showErrorToast } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import HospitalAppointmentModal, {
  HospitalAppointmentFormData,
} from '@/components/hospital/HospitalAppointmentModal';
import HospitalBookingLoginDialog from '@/components/hospital/HospitalBookingLoginDialog';
import { getHospitalDetailPath, HospitalViewMode } from '@/components/hospital/hospitalPaths';
import { useHospitalBookingGate } from '@/hooks/useHospitalBookingGate';

interface HospitalCardProps {
  hospital: IHospitalListItem;
  mode: HospitalViewMode;
}

const HospitalCard = ({ hospital, mode }: HospitalCardProps): JSX.Element => {
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    loginPromptOpen,
    setLoginPromptOpen,
    bookingModalOpen,
    setBookingModalOpen,
    requestBooking,
    proceedToLogin,
  } = useHospitalBookingGate();
  const {
    id,
    name,
    slug,
    organizationType,
    hasEmergency,
    telemedicine,
    primaryAddress,
    images,
    bedCount,
  } = hospital;

  const galleryImages = (images?.filter((img) => img.type === 'photo') ?? []).sort((a, b) => {
    const orderA = (a.meta as { displayOrder?: number })?.displayOrder ?? 999;
    const orderB = (b.meta as { displayOrder?: number })?.displayOrder ?? 999;
    return orderA - orderB;
  });
  const primaryImage = galleryImages.length > 0 ? galleryImages[0] : null;
  const logoImage = images?.find((img) => img.type === 'logo') ?? null;

  const handleViewDetails = (): void => {
    if (!slug) {
      console.error('Hospital slug is missing');
      return;
    }
    router.push(getHospitalDetailPath(slug, mode));
  };

  const handleBookAppointment = async (data: HospitalAppointmentFormData): Promise<void> => {
    setIsBookingLoading(true);
    try {
      const result = await dispatch(
        createHospitalAppointment({
          hospitalId: id,
          name: data.name,
          telephone: data.telephone,
          serviceType: data.serviceType,
          additionalInfo: data.additionalInfo,
          date: data.date,
        }),
      );
      const payload = result.payload;
      if (payload && showErrorToast(payload)) {
        toast(payload);
      } else {
        toast(payload as Parameters<typeof toast>[0]);
      }
    } finally {
      setIsBookingLoading(false);
    }
  };

  const getOrganizationTypeLabel = (type?: string): string => {
    switch (type) {
      case 'private':
        return 'Private Hospital';
      case 'public':
        return 'Public Hospital';
      case 'teaching':
        return 'Teaching Hospital';
      case 'clinic':
        return 'Clinic';
      default:
        return 'Hospital';
    }
  };

  const cityLabel = primaryAddress?.city || primaryAddress?.state;

  return (
    <>
      <HospitalBookingLoginDialog
        open={loginPromptOpen}
        onOpenChange={setLoginPromptOpen}
        onProceed={proceedToLogin}
      />
      <HospitalAppointmentModal
        open={bookingModalOpen}
        setOpen={setBookingModalOpen}
        hospitalName={name}
        onSubmit={handleBookAppointment}
        isLoading={isBookingLoading}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={handleViewDetails}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleViewDetails();
          }
        }}
        className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
        aria-label={`View details for ${name}`}
      >
        <div className="relative h-56 w-full shrink-0 overflow-hidden bg-gray-200 sm:h-60">
          {primaryImage ? (
            <Image src={primaryImage.url} alt={name} fill className="object-cover object-top" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-100 via-blue-100 to-indigo-100 p-8">
              <Image
                src={Logo}
                alt="Fornix Link"
                className="h-auto w-full max-w-[140px] object-contain"
              />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black from-25% via-black/90 via-55% to-transparent" />

          {logoImage && (
            <div className="absolute top-3 left-3 z-20">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-white shadow-lg">
                <Image
                  src={logoImage.url}
                  alt={`${name} logo`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            </div>
          )}

          <div
            className="absolute top-3 right-3 z-20"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-md transition-all hover:bg-white hover:shadow-xl"
                  aria-label="Hospital actions"
                >
                  <MoreVertical size={20} className="text-gray-800" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails();
                  }}
                >
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    requestBooking();
                  }}
                >
                  Book Appointment
                </DropdownMenuItem>
                {primaryAddress?.city && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      const query = encodeURIComponent(
                        `${name} ${primaryAddress.city} ${primaryAddress.state || ''}`,
                      );
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${query}`,
                        '_blank',
                      );
                    }}
                  >
                    Open in Maps
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-3.5 pb-3.5">
            <h3 className="line-clamp-2 text-xl leading-snug font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-[22px]">
              {name}
            </h3>
            {cityLabel && (
              <p className="mt-1 flex items-center gap-1 truncate text-sm font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                <MapPin size={14} className="shrink-0" />
                {cityLabel}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 p-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-xl border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
              {getOrganizationTypeLabel(organizationType)}
            </span>
            {hasEmergency && (
              <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
                <Clock size={10} />
                24/7
              </span>
            )}
            {telemedicine && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <Globe size={10} />
                Virtual
              </span>
            )}
            {bedCount ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                <BedDouble size={10} />
                {bedCount}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default HospitalCard;
