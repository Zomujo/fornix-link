'use client';
import React, { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { getHospitalBySlug } from '@/lib/features/hospitals/hospitalThunk';
import { useAppDispatch } from '@/lib/hooks';
import { showErrorToast } from '@/lib/utils';
import {
  HospitalImageType,
  IHospitalDetail,
  IHospitalImage,
  IHospitalOpeningHours,
  OrganizationType,
} from '@/types/hospital.interface';
import {
  Building2,
  CalendarCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  CheckCircle2,
  ExternalLink,
  Images,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import SkeletonDoctorPatientCard from '@/components/skeleton/skeletonDoctorPatientCard';
import BookingModals from '@/components/doctor/BookingModals';
import HospitalBookingLoginDialog from '@/components/hospital/HospitalBookingLoginDialog';
import ReviewSection from '@/components/hospital/ReviewSection';
import { useHospitalBookingGate } from '@/hooks/useHospitalBookingGate';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { buildHospitalBookingProvider } from '@/lib/utils/bookingProviderUtils';
import { PublicHospitalShell } from '@/components/hospital/PublicHospitalShell';
import { getHospitalListPath, HospitalViewMode } from '@/components/hospital/hospitalPaths';
import { Logo } from '@/assets/images';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface HospitalDetailViewProps {
  slug: string;
  mode: HospitalViewMode;
}

/** Matches hospital settings gallery cap. */
const MAX_GALLERY_IMAGES = 10;

const insuranceLogoMap: Record<string, string> = {
  nhis: '/images/insurance/nhis.jpeg',
  acacia: '/images/insurance/acacia.jpeg',
  ace: '/images/insurance/ace.png',
  apex: '/images/insurance/apex.png',
  cosmopolitan: '/images/insurance/cosmopolitan.jpeg',
  dosh: '/images/insurance/dosh.jpeg',
  equity: '/images/insurance/equity.jpeg',
  glico: '/images/insurance/glico.png',
};

const accreditationLogoMap: Record<string, string> = {
  'ministry of health': '/images/insurance/moh.jpeg',
  'medical council': '/images/insurance/medicalcouncil.jpeg',
};

const privateInsurers = [
  { key: 'acacia', label: 'Acacia' },
  { key: 'ace', label: 'Ace Medical' },
  { key: 'apex', label: 'Apex' },
  { key: 'cosmopolitan', label: 'Cosmopolitan' },
  { key: 'dosh', label: 'Dosh' },
  { key: 'equity', label: 'Equity' },
  { key: 'glico', label: 'GLICO' },
] as const;

function getOrganizationTypeLabel(type?: string): string {
  switch (type) {
    case OrganizationType.Private:
      return 'Private Hospital';
    case OrganizationType.Public:
      return 'Public Hospital';
    case OrganizationType.Teaching:
      return 'Teaching Hospital';
    case OrganizationType.Clinic:
      return 'Clinic';
    default:
      return 'Hospital';
  }
}

function getOpeningHourClass(hour: { isClosed?: boolean; is24Hours?: boolean }): string {
  if (hour.isClosed) {
    return 'text-red-600';
  }
  if (hour.is24Hours) {
    return 'text-emerald-700';
  }
  return 'text-gray-700';
}

function getOpeningHourLabel(hour: {
  isClosed?: boolean;
  is24Hours?: boolean;
  openTime?: string;
  closeTime?: string;
}): string {
  if (hour.isClosed) {
    return 'Closed';
  }
  if (hour.is24Hours) {
    return '24 Hours';
  }
  if (hour.openTime && hour.closeTime) {
    return `${hour.openTime} – ${hour.closeTime}`;
  }
  return 'Hours vary';
}

function getAvailabilityBadgeClass(availability: string): string {
  if (availability === 'available') {
    return 'bg-emerald-50 text-emerald-700';
  }
  if (availability === 'limited') {
    return 'bg-amber-50 text-amber-800';
  }
  return 'bg-gray-100 text-gray-600';
}

function parseAccreditationsList(accreditations: unknown): unknown[] {
  if (Array.isArray(accreditations)) {
    return accreditations;
  }
  if (typeof accreditations !== 'object' || accreditations === null) {
    return [];
  }
  const withAcc = accreditations as { accreditations?: unknown[] };
  if (Array.isArray(withAcc?.accreditations)) {
    return withAcc.accreditations;
  }
  try {
    const parsed = typeof accreditations === 'string' ? JSON.parse(accreditations) : accreditations;
    if (Array.isArray((parsed as { accreditations?: unknown[] })?.accreditations)) {
      return (parsed as { accreditations?: unknown[] }).accreditations ?? [];
    }
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    return [accreditations];
  }
  return [];
}

function isTodayWeekday(weekday: string): boolean {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()] === weekday.toLowerCase();
}

function openMapsSearch(query: string): void {
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
    '_blank',
  );
}

/** Align with settings: gallery = everything that isn’t the logo. */
function getGalleryPhotos(images: IHospitalImage[] | undefined): IHospitalImage[] {
  const photos = (images ?? []).filter((img) => img.type !== HospitalImageType.Logo);
  const sorted = photos.toSorted((a, b) => {
    const orderA = (a.meta as { displayOrder?: number } | undefined)?.displayOrder ?? 999;
    const orderB = (b.meta as { displayOrder?: number } | undefined)?.displayOrder ?? 999;
    return orderA - orderB;
  });
  return sorted.slice(0, MAX_GALLERY_IMAGES);
}

function getVisitStatus(openingHours?: IHospitalOpeningHours[]): string | null {
  if (!openingHours?.length) {
    return null;
  }
  const today = openingHours.find((h) => isTodayWeekday(h.weekday));
  if (!today) {
    return null;
  }
  if (today.isClosed) {
    const nextOpen = openingHours.find(
      (h) => !h.isClosed && !isTodayWeekday(h.weekday) && (h.is24Hours || h.openTime),
    );
    if (nextOpen?.is24Hours) {
      return `Closed · Opens ${nextOpen.weekday}`;
    }
    if (nextOpen?.openTime) {
      return `Closed · Opens ${nextOpen.weekday} ${nextOpen.openTime}`;
    }
    return 'Closed today';
  }
  if (today.is24Hours) {
    return 'Open · 24 hours';
  }
  if (today.closeTime) {
    return `Open · until ${today.closeTime}`;
  }
  return 'Open today';
}

const HospitalDetailView = ({ slug, mode }: HospitalDetailViewProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [hospital, setHospital] = useState<IHospitalDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const photoScrollRef = useRef<HTMLDivElement>(null);
  const { loginPromptOpen, setLoginPromptOpen, requestBooking, proceedToLogin } =
    useHospitalBookingGate();

  const bookingProvider = useMemo(
    () =>
      hospital
        ? buildHospitalBookingProvider({
            id: hospital.id,
            name: hospital.name,
            accreditations: hospital.accreditations,
            images: hospital.images,
            organizationType: hospital.organizationType,
          })
        : null,
    [hospital],
  );

  const {
    showSlots,
    setShowSlots,
    showPreview,
    setShowPreview,
    isInitiatingPayment,
    register,
    setValue,
    watch,
    handleContinueBooking,
    handleConfirmAndPay,
  } = useBookingFlow({
    provider: bookingProvider ?? {
      type: 'hospital',
      id: '',
      name: '',
      fee: 0,
    },
  });

  const handleBookClick = (): void => {
    if (requestBooking()) {
      setShowSlots(true);
    }
  };

  useEffect(() => {
    async function fetchHospital(): Promise<void> {
      setIsLoading(true);
      const { payload } = await dispatch(getHospitalBySlug(slug));

      if (payload && showErrorToast(payload)) {
        toast(payload);
        setIsLoading(false);
        return;
      }
      setHospital(payload as IHospitalDetail);
      setIsLoading(false);
    }

    void fetchHospital();
  }, [slug, dispatch]);

  useEffect(() => {
    setActivePhotoIndex(0);
    photoScrollRef.current?.scrollTo({ left: 0 });
  }, [slug]);

  const handleBack = (): void => {
    if (mode === 'public') {
      router.push(getHospitalListPath('public'));
      return;
    }
    router.back();
  };

  if (isLoading) {
    const loadingContent = (
      <div className="flex flex-col gap-6">
        <SkeletonDoctorPatientCard />
        <SkeletonDoctorPatientCard />
        <SkeletonDoctorPatientCard />
      </div>
    );
    if (mode === 'public') {
      return <PublicHospitalShell>{loadingContent}</PublicHospitalShell>;
    }
    return loadingContent;
  }

  if (!hospital) {
    const notFoundContent = (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-600">Hospital not found</p>
        <Button onClick={handleBack} child="Go Back" className="mt-4" />
      </div>
    );
    if (mode === 'public') {
      return <PublicHospitalShell>{notFoundContent}</PublicHospitalShell>;
    }
    return notFoundContent;
  }

  const {
    name,
    description,
    organizationType,
    hasEmergency,
    telemedicine,
    bedCount,
    accreditations,
    addresses,
    images,
    services,
    amenities,
    openingHours,
    insuranceNetworks,
    mainPhone,
    mainEmail,
    website,
  } = hospital;

  const logoImage = images?.find((img) => img.type === HospitalImageType.Logo);
  const photoImages = getGalleryPhotos(images);
  const heroImage = photoImages[0] ?? null;
  const sideThumbs = photoImages.slice(1, 5);
  const overflowCount = Math.max(0, photoImages.length - 5);
  const accreditationsList = parseAccreditationsList(accreditations);
  const descriptionLong = (description?.length ?? 0) > 220;
  const visitStatus = getVisitStatus(openingHours);
  const metaParts = [
    hasEmergency ? '24/7 emergency' : null,
    telemedicine ? 'Telemedicine' : null,
    bedCount ? `${bedCount} beds` : null,
  ].filter(Boolean) as string[];

  const openLightbox = (index: number): void => {
    setLightboxIndex(index);
  };

  const getPhotoTrack = (): HTMLElement | null => {
    const container = photoScrollRef.current;
    if (!container) {
      return null;
    }
    return container.firstElementChild as HTMLElement | null;
  };

  const scrollToPhoto = (index: number): void => {
    const container = photoScrollRef.current;
    const track = getPhotoTrack();
    if (!container || !track) {
      return;
    }
    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) {
      return;
    }
    const paddingLeft = Number.parseFloat(getComputedStyle(track).paddingLeft) || 0;
    container.scrollTo({
      left: Math.max(0, slide.offsetLeft - paddingLeft),
      behavior: 'smooth',
    });
    setActivePhotoIndex(index);
  };

  const handlePhotoScroll = (): void => {
    const container = photoScrollRef.current;
    const track = getPhotoTrack();
    if (!container || !track || photoImages.length === 0) {
      return;
    }
    const paddingLeft = Number.parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const anchor = container.scrollLeft + paddingLeft;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    Array.from(track.children).forEach((child, index) => {
      const el = child as HTMLElement;
      const distance = Math.abs(el.offsetLeft - anchor);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    setActivePhotoIndex(closestIndex);
  };

  const renderBookButton = (className?: string): JSX.Element => (
    <Button
      onClick={handleBookClick}
      className={className}
      child={
        <>
          <CalendarCheck size={16} />
          Book Appointment
        </>
      }
    />
  );

  const detailContent = (
    <div className="flex flex-col gap-8 pb-28 sm:pb-8">
      <HospitalBookingLoginDialog
        open={loginPromptOpen}
        onOpenChange={setLoginPromptOpen}
        onProceed={proceedToLogin}
      />
      {bookingProvider && (
        <BookingModals
          showSlots={showSlots}
          setShowSlots={setShowSlots}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          isInitiatingPayment={isInitiatingPayment}
          provider={bookingProvider}
          register={register}
          setValue={setValue}
          watch={watch}
          handleContinueBooking={handleContinueBooking}
          handleConfirmAndPay={handleConfirmAndPay}
        />
      )}

      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            setLightboxIndex(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl border-0 bg-transparent p-0 shadow-none sm:max-w-4xl">
          <DialogTitle className="sr-only">
            {name} photo {(lightboxIndex ?? 0) + 1} of {photoImages.length}
          </DialogTitle>
          {lightboxIndex !== null && photoImages[lightboxIndex] && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/90 sm:aspect-video">
              <Image
                src={photoImages[lightboxIndex].url}
                alt={`${name} photo ${lightboxIndex + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/50 px-4 py-3 text-sm text-white">
                <span>
                  {lightboxIndex + 1} / {photoImages.length}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-md bg-white/15 px-3 py-1.5 hover:bg-white/25 disabled:opacity-40"
                    disabled={lightboxIndex <= 0}
                    onClick={() => setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : i))}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-white/15 px-3 py-1.5 hover:bg-white/25 disabled:opacity-40"
                    disabled={lightboxIndex >= photoImages.length - 1}
                    onClick={() =>
                      setLightboxIndex((i) =>
                        i !== null ? Math.min(photoImages.length - 1, i + 1) : i,
                      )
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between gap-3">
        <Button
          onClick={handleBack}
          variant="ghost"
          child={
            <>
              <ChevronLeft size={18} />
              <span>Back</span>
            </>
          }
          className="w-fit text-gray-600 hover:text-gray-900"
        />
        <div className="hidden sm:block">{renderBookButton()}</div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {photoImages.length === 0 ? (
          <div className="relative flex h-48 w-full items-center justify-center bg-gray-100 sm:h-64">
            <Image
              src={Logo}
              alt=""
              className="h-auto w-full max-w-[140px] object-contain opacity-40"
            />
          </div>
        ) : photoImages.length === 1 ? (
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="relative block h-56 w-full bg-gray-100 sm:h-72 md:h-80"
            aria-label={`View photo of ${name}`}
          >
            <Image
              src={heroImage!.url}
              alt={name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1152px"
            />
          </button>
        ) : (
          <div className="grid h-56 grid-cols-1 gap-1 bg-gray-100 sm:h-72 sm:grid-cols-[1.6fr_1fr] md:h-80">
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="relative min-h-0 w-full"
              aria-label={`View photo 1 of ${name}`}
            >
              <Image
                src={heroImage!.url}
                alt={name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 70vw"
              />
            </button>
            <div className="hidden min-h-0 grid-cols-2 grid-rows-2 gap-1 sm:grid">
              {sideThumbs.map((img, i) => {
                const index = i + 1;
                const isLast = i === sideThumbs.length - 1 && overflowCount > 0;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => openLightbox(index)}
                    className="relative min-h-0 w-full overflow-hidden"
                    aria-label={
                      isLast
                        ? `View all ${photoImages.length} photos`
                        : `View photo ${index + 1} of ${name}`
                    }
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 240px"
                    />
                    {isLast && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-medium text-white">
                        <Images size={16} className="mr-1.5" />+{overflowCount} more
                      </span>
                    )}
                  </button>
                );
              })}
              {Array.from({ length: Math.max(0, 4 - sideThumbs.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-gray-200" />
              ))}
            </div>
          </div>
        )}

        {photoImages.length > 1 && (
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-2.5 sm:px-8">
            <p className="text-sm text-gray-500">
              {photoImages.length} photo{photoImages.length === 1 ? '' : 's'}
            </p>
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 underline-offset-2 hover:underline"
            >
              <Images size={15} className="text-gray-400" />
              View gallery
            </button>
          </div>
        )}

        <div className="flex flex-col gap-5 px-5 py-6 sm:px-8 sm:py-7">
          <div className="flex items-start gap-4">
            {logoImage && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <Image src={logoImage.url} alt="" fill className="object-cover" sizes="64px" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
                {name}
              </h1>
              <p className="mt-1 text-sm leading-snug text-gray-500">
                {getOrganizationTypeLabel(organizationType)}
                {metaParts.length > 0 && (
                  <span className="text-gray-400"> · {metaParts.join(' · ')}</span>
                )}
              </p>
            </div>
          </div>

          {description && (
            <div>
              <p
                className={`max-w-3xl text-[15px] leading-relaxed text-gray-600 ${
                  !descriptionExpanded && descriptionLong ? 'line-clamp-3' : ''
                }`}
              >
                {description}
              </p>
              {descriptionLong && (
                <button
                  type="button"
                  onClick={() => setDescriptionExpanded((v) => !v)}
                  className="mt-1.5 text-sm font-medium text-gray-900 underline-offset-2 hover:underline"
                >
                  {descriptionExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}

          {mainPhone || mainEmail || website ? (
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {mainPhone && (
                  <a
                    href={`tel:${mainPhone}`}
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
                  >
                    <Phone size={15} className="shrink-0 text-gray-400" />
                    <span className="break-all">{mainPhone}</span>
                  </a>
                )}
                {mainEmail && (
                  <a
                    href={`mailto:${mainEmail}`}
                    className="inline-flex max-w-full items-center gap-2 text-gray-700 hover:text-gray-900"
                  >
                    <Mail size={15} className="shrink-0 text-gray-400" />
                    <span className="truncate">{mainEmail}</span>
                  </a>
                )}
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
                  >
                    <Globe size={15} className="shrink-0 text-gray-400" />
                    Website
                    <ExternalLink size={12} className="text-gray-400" />
                  </a>
                )}
              </div>
              <div className="hidden shrink-0 sm:block">{renderBookButton()}</div>
            </div>
          ) : (
            <div className="hidden justify-end border-t border-gray-100 pt-4 sm:flex">
              {renderBookButton()}
            </div>
          )}
        </div>
      </section>

      {photoImages.length > 0 && (
        <section className="w-full min-w-0">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Photos</h2>
            <span className="text-sm text-gray-400 tabular-nums">
              {activePhotoIndex + 1}/{photoImages.length}
            </span>
          </div>
          <div
            ref={photoScrollRef}
            onScroll={handlePhotoScroll}
            className="touch-pan-x overflow-x-auto overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={`${name} photo gallery`}
          >
            <div className="relative flex w-max snap-x snap-mandatory gap-3 px-3 py-3">
              {photoImages.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => {
                    setActivePhotoIndex(index);
                    openLightbox(index);
                  }}
                  className={`relative h-44 w-[min(88vw,360px)] shrink-0 snap-start overflow-hidden rounded-xl bg-gray-100 sm:h-56 sm:w-[420px] ${
                    index === activePhotoIndex ? 'ring-primary ring-2 ring-offset-2' : ''
                  }`}
                  aria-label={`View photo ${index + 1}`}
                  aria-current={index === activePhotoIndex}
                >
                  <Image
                    src={img.url}
                    alt={`${name} photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 88vw, 420px"
                  />
                </button>
              ))}
            </div>
          </div>
          {photoImages.length > 1 && (
            <div
              className="mt-1 flex w-full flex-wrap gap-1.5 px-3 py-1"
              role="tablist"
              aria-label="Photo position"
            >
              {photoImages.map((img, index) => (
                <button
                  key={`indicator-${img.id}`}
                  type="button"
                  onClick={() => scrollToPhoto(index)}
                  className={`relative h-6 w-6 overflow-hidden rounded-sm bg-gray-200 sm:h-7 sm:w-7 ${
                    index === activePhotoIndex
                      ? 'ring-primary opacity-100 ring-2 ring-offset-1'
                      : 'opacity-45 hover:opacity-80'
                  }`}
                  aria-label={`Go to photo ${index + 1}`}
                  aria-current={index === activePhotoIndex}
                >
                  <Image src={img.url} alt="" fill className="object-cover" sizes="28px" />
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="grid grid-cols-1 items-start gap-8 border-t border-gray-100 pt-8 lg:grid-cols-2">
        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
          <div className="hidden flex-col gap-3 self-start rounded-xl border border-gray-200 bg-white p-4 sm:flex">
            {visitStatus ? (
              <p className="text-sm font-medium text-gray-900">{visitStatus}</p>
            ) : (
              <p className="text-sm text-gray-600">Book a visit</p>
            )}
            {renderBookButton('w-full')}
            {mainPhone && (
              <a
                href={`tel:${mainPhone}`}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <Phone size={15} />
                Call {mainPhone}
              </a>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-6 self-start sm:col-span-1">
            {addresses && addresses.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">Location</h2>
                <div className="flex flex-col gap-5">
                  {addresses.map((address) => (
                    <div key={address.id} className="text-sm">
                      {address.label && (
                        <p className="mb-1 font-medium text-gray-900">{address.label}</p>
                      )}
                      <div className="leading-relaxed text-gray-600">
                        {address.street && <p>{address.street}</p>}
                        {[address.city, address.state, address.postalCode].some(Boolean) && (
                          <p>
                            {[address.city, address.state, address.postalCode]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        )}
                        {address.country && <p>{address.country}</p>}
                      </div>
                      {address.phone && (
                        <a
                          href={`tel:${address.phone}`}
                          className="mt-1.5 inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900"
                        >
                          <Phone size={13} className="text-gray-400" />
                          {address.phone}
                        </a>
                      )}
                      {address.city && (
                        <button
                          type="button"
                          onClick={() =>
                            openMapsSearch(
                              `${name} ${address.street || ''} ${address.city} ${address.state || ''}`,
                            )
                          }
                          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 underline-offset-2 hover:underline"
                        >
                          <MapPin size={14} className="text-gray-400" />
                          Open in Maps
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {openingHours && openingHours.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">Hours</h2>
                <ul className="text-sm">
                  {openingHours.map((hour) => {
                    const today = isTodayWeekday(hour.weekday);
                    return (
                      <li
                        key={hour.id}
                        className={`flex items-baseline justify-between gap-3 py-1.5 ${
                          today ? 'font-medium text-gray-900' : 'text-gray-600'
                        }`}
                      >
                        <span className="capitalize">
                          {hour.weekday}
                          {today && (
                            <span className="ml-1.5 text-xs font-normal text-gray-400">Today</span>
                          )}
                        </span>
                        <span className={getOpeningHourClass(hour)}>
                          {getOpeningHourLabel(hour)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>
        </div>

        {insuranceNetworks && insuranceNetworks.length > 0 && (
          <section className="min-w-0 self-start">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Accepted insurance</h2>
            <ul className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
              {insuranceNetworks.map((network) => {
                const codeKey = network.insuranceCompany.code?.toLowerCase() || '';
                const nameKey = network.insuranceCompany.name?.toLowerCase() || '';
                const mappedLogo = insuranceLogoMap[codeKey] || insuranceLogoMap[nameKey];
                const logoSrc = mappedLogo || network.insuranceCompany.logo;
                const isPrivateGroup =
                  nameKey === 'private health insurance' || codeKey === 'private';

                if (isPrivateGroup) {
                  return (
                    <li key={network.id} className="md:col-span-2">
                      <p className="mb-2 text-sm font-medium text-gray-900">
                        Private health insurance
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {privateInsurers.map((insurer) => {
                          const src = insuranceLogoMap[insurer.key];
                          return (
                            <div
                              key={insurer.key}
                              className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50 px-2 py-1"
                              title={insurer.label}
                            >
                              {src && (
                                <div className="relative h-5 w-5 overflow-hidden rounded-sm bg-white">
                                  <Image
                                    src={src}
                                    alt=""
                                    fill
                                    className="object-contain"
                                    sizes="20px"
                                  />
                                </div>
                              )}
                              <span className="text-xs text-gray-600">{insurer.label}</span>
                            </div>
                          );
                        })}
                      </div>
                      {network.planNotes && (
                        <p className="mt-1.5 text-xs text-gray-500">{network.planNotes}</p>
                      )}
                    </li>
                  );
                }

                return (
                  <li key={network.id} className="flex min-w-0 items-center gap-3">
                    {logoSrc && (
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded border border-gray-100 bg-white p-0.5">
                        <Image src={logoSrc} alt="" fill className="object-contain" sizes="36px" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {network.insuranceCompany.name}
                      </p>
                      {network.planNotes && (
                        <p className="text-xs text-gray-500">{network.planNotes}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      <div className="flex flex-col gap-10 border-t border-gray-100 pt-8">
        {services && services.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Services</h2>
            <ul className="divide-y divide-gray-100 border-y border-gray-100">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">{service.service.name}</p>
                    {service.service.description && (
                      <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
                        {service.service.description}
                      </p>
                    )}
                    {service.notes && <p className="mt-1 text-xs text-gray-500">{service.notes}</p>}
                  </div>
                  <span
                    className={`mt-1 w-fit shrink-0 rounded-md px-2 py-0.5 text-xs font-medium capitalize ${getAvailabilityBadgeClass(
                      service.availability,
                    )}`}
                  >
                    {service.availability.replace('_', ' ')}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {amenities && amenities.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Amenities</h2>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2 md:grid-cols-3">
              {amenities.map((amenity) => (
                <li key={amenity.id} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="shrink-0 text-gray-400" />
                  {amenity.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        {accreditationsList.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Accreditations</h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {accreditationsList.map((acc: unknown) => {
                const accObj =
                  typeof acc === 'object' && acc !== null ? (acc as Record<string, unknown>) : {};
                const body =
                  (accObj.body as string) ||
                  (accObj.name as string) ||
                  (accObj.title as string) ||
                  (typeof acc === 'string' ? acc : 'Accreditation');
                const date = (accObj.date ?? accObj.issuedDate ?? accObj.year) as
                  | string
                  | undefined;
                const bodyKey = typeof body === 'string' ? body.toLowerCase() : '';
                const logoSrc = accreditationLogoMap[bodyKey];
                const itemKey = `accreditation-${body}-${String(date ?? '')}`;
                return (
                  <li key={itemKey} className="flex items-center gap-2.5 text-sm text-gray-700">
                    {logoSrc ? (
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-white">
                        <Image src={logoSrc} alt="" fill className="object-contain" sizes="32px" />
                      </div>
                    ) : (
                      <Building2 size={16} className="shrink-0 text-gray-400" />
                    )}
                    <span>
                      {body}
                      {date && (
                        <span className="text-gray-400">
                          {' '}
                          ·{' '}
                          {new Date(date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <ReviewSection hospitalName={name} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:hidden">
        {visitStatus && <p className="mb-2 text-center text-xs text-gray-500">{visitStatus}</p>}
        <div className="flex gap-2">
          {mainPhone && (
            <a
              href={`tel:${mainPhone}`}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-gray-200 px-3.5 text-sm font-medium text-gray-700"
              aria-label={`Call ${mainPhone}`}
            >
              <Phone size={16} />
            </a>
          )}
          {renderBookButton('h-11 w-full')}
        </div>
      </div>
    </div>
  );

  if (mode === 'public') {
    return <PublicHospitalShell>{detailContent}</PublicHospitalShell>;
  }

  return detailContent;
};

export default HospitalDetailView;
