'use client';

import { MapPin, X, MoreVertical, Clock, Globe, BedDouble } from 'lucide-react';
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
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectUser } from '@/lib/features/auth/authSelector';
import { createHospitalAppointment } from '@/lib/features/hospital-appointments/hospitalAppointmentsThunk';
import { showErrorToast } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { LocalStorageManager } from '@/lib/localStorage';
import HospitalAppointmentModal, {
  HospitalAppointmentFormData,
} from '@/components/hospital/HospitalAppointmentModal';
import { getHospitalDetailPath, HospitalViewMode } from '@/components/hospital/hospitalPaths';

interface HospitalCardProps {
  hospital: IHospitalListItem;
  mode: HospitalViewMode;
}

const HospitalCard = ({ hospital, mode }: HospitalCardProps): JSX.Element => {
  const [showPreview, setShowPreview] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectUser);
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

  const handleBookingClick = (): void => {
    if (mode === 'public' && !user) {
      LocalStorageManager.saveRedirectUrl(
        globalThis.location.pathname + globalThis.location.search,
      );
      router.push('/login');
      return;
    }
    setBookingModalOpen(true);
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

  return (
    <>
      <HospitalAppointmentModal
        open={bookingModalOpen}
        setOpen={setBookingModalOpen}
        hospitalName={name}
        onSubmit={handleBookAppointment}
        isLoading={isBookingLoading}
      />

      {showPreview && primaryImage && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex cursor-default items-center justify-center border-0 bg-black/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPreview(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              e.preventDefault();
              setShowPreview(false);
            }
          }}
          aria-label="Close preview"
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="absolute -top-4 -right-4 z-10 rounded-full bg-white p-2 shadow-lg transition-all hover:scale-110"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <Image
              src={primaryImage.url}
              alt={name}
              width={800}
              height={600}
              className="rounded-lg object-contain shadow-2xl"
            />
          </div>
        </button>
      )}

      <div className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 select-none hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl">
        <div className="relative h-[240px] w-full overflow-hidden sm:h-[290px] md:h-[350px]">
          {primaryImage ? (
            <button
              type="button"
              className="relative h-full w-full cursor-pointer border-0 bg-transparent p-0 text-left"
              onClick={() => setShowPreview(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowPreview(true);
                }
              }}
            >
              <Image
                src={primaryImage.url}
                alt={name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </button>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 p-8">
              <Image
                src={Logo}
                alt="Fornix Link"
                className="h-auto w-full max-w-[180px] object-contain"
              />
            </div>
          )}

          {logoImage && (
            <div className="absolute top-4 left-4 z-20">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-white shadow-lg sm:h-11 sm:w-11 md:h-12 md:w-12">
                <Image
                  src={logoImage.url}
                  alt={`${name} logo`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            </div>
          )}

          <div className="absolute top-4 right-4 z-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-white hover:shadow-xl">
                  <MoreVertical size={20} className="text-gray-800" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleViewDetails}>View Details</DropdownMenuItem>
                <DropdownMenuItem onClick={handleBookingClick}>Book Appointment</DropdownMenuItem>
                {primaryAddress?.city && (
                  <DropdownMenuItem
                    onClick={() => {
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

          <div className="absolute right-0 bottom-0 left-0 z-10 h-[55%] overflow-hidden">
            <div className="absolute top-0 -right-1 -bottom-1 -left-1 rounded-b-2xl bg-white sm:rounded-b-3xl"></div>
            <div
              className="relative h-full rounded-b-2xl sm:rounded-b-3xl"
              style={{
                background:
                  'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 30%, rgba(255, 255, 255, 0.95) 60%, rgba(255, 255, 255, 0.85) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <div className="relative z-20 flex h-full flex-col justify-between px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4">
                <div className="flex min-h-[3em] min-w-0 flex-1 flex-col justify-center">
                  <h3 className="line-clamp-2 text-base leading-snug font-bold break-words text-gray-900 sm:text-lg">
                    {name}
                  </h3>
                </div>

                <div className="flex-shrink-0 space-y-1.5 pt-1.5 sm:space-y-2">
                  {primaryAddress && (primaryAddress.city || primaryAddress.state) && (
                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-gray-700 sm:text-sm">
                      <MapPin
                        size={12}
                        className="flex-shrink-0 text-gray-500 sm:h-[14px] sm:w-[14px]"
                      />
                      <span className="truncate font-medium">
                        {primaryAddress.city || primaryAddress.state}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="flex-shrink-0 rounded-xl border-2 border-green-300 bg-green-50 px-2.5 py-1.5 text-[10px] font-semibold whitespace-nowrap text-green-700 shadow-sm sm:px-3 sm:py-2 sm:text-xs">
                      {getOrganizationTypeLabel(organizationType)}
                    </span>

                    {(hasEmergency || telemedicine || bedCount) && (
                      <div className="flex flex-1 flex-wrap items-center justify-end gap-1 overflow-visible sm:gap-1.5">
                        {hasEmergency && (
                          <span className="flex flex-shrink-0 items-center gap-0.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-semibold whitespace-nowrap text-red-700 sm:gap-1 sm:px-2 sm:py-1 sm:text-[10px]">
                            <Clock size={9} className="sm:h-[10px] sm:w-[10px]" />
                            24/7
                          </span>
                        )}
                        {telemedicine && (
                          <span className="flex flex-shrink-0 items-center gap-0.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[9px] font-semibold whitespace-nowrap text-green-700 sm:gap-1 sm:px-2 sm:py-1 sm:text-[10px]">
                            <Globe size={9} className="sm:h-[10px] sm:w-[10px]" />
                            Virtual
                          </span>
                        )}
                        {bedCount && (
                          <span className="flex flex-shrink-0 items-center gap-0.5 rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-semibold whitespace-nowrap text-blue-700 sm:gap-1 sm:px-2 sm:py-1 sm:text-[10px]">
                            <BedDouble size={9} className="sm:h-[10px] sm:w-[10px]" />
                            {bedCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HospitalCard;
