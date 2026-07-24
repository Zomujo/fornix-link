'use client';

import { NotFound } from '@/assets/images';
import SkeletonDoctorPatientCard from '@/components/skeleton/skeletonDoctorPatientCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaginationData } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { useSearch } from '@/hooks/useSearch';
import { getAllHospitals } from '@/lib/features/hospitals/hospitalThunk';
import { useAppDispatch } from '@/lib/hooks';
import { showErrorToast } from '@/lib/utils';
import { IHospitalListItem } from '@/types/hospital.interface';
import { AcceptDeclineStatus, OrderDirection } from '@/types/shared.enum';
import { IPagination, IQueryParams } from '@/types/shared.interface';
import { ChevronUp, Search, SendHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { FormEvent, JSX, useCallback, useEffect, useRef, useState } from 'react';
import HospitalCard from '@/components/hospital/HospitalCard';
import HospitalFilters from '@/components/hospital/HospitalFilters';
import { PublicHospitalShell } from '@/components/hospital/PublicHospitalShell';
import { HospitalViewMode } from '@/components/hospital/hospitalPaths';
import { useQueryParam } from '@/hooks/useQueryParam';

const HOSPITAL_GRID_CLASS = 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3';

interface HospitalListViewProps {
  mode: HospitalViewMode;
}

const HospitalListView = ({ mode }: HospitalListViewProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { searchTerm, handleSearch } = useSearch(handleSubmit);
  const [isLoading, setIsLoading] = useState(true);
  const [hospitals, setHospitals] = useState<IHospitalListItem[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData | undefined>(undefined);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const { getQueryParam } = useQueryParam();
  const searchParams = useSearchParams();
  const getParam = (key: string): string | null => searchParams.get(key);

  const [queryParameters, setQueryParameters] = useState<
    IQueryParams<AcceptDeclineStatus> & {
      city?: string;
      nearMe?: boolean;
      organizationType?: string;
      hasEmergency?: boolean;
      telemedicine?: boolean;
      serviceId?: string;
      departmentId?: string;
      insuranceCompanyId?: string;
      languages?: string[];
      isActive?: boolean;
      minConsultationFee?: number;
      maxConsultationFee?: number;
      openNow?: boolean;
      open24_7?: boolean;
      onsitePharmacy?: boolean;
      onsiteLabs?: boolean;
      ambulanceServices?: boolean;
    }
  >({
    page: 1,
    orderDirection: OrderDirection.Descending,
    orderBy: 'createdAt',
    search: getQueryParam('search'),
    pageSize: 12,
    status: AcceptDeclineStatus.Accepted,
    isActive: true,
    city: getParam('city') || '',
    nearMe: getParam('nearMe') === 'true' ? true : undefined,
    organizationType: getParam('organizationType') || '',
    hasEmergency: getParam('hasEmergency') === 'true' ? true : undefined,
    telemedicine: getParam('telemedicine') === 'true' ? true : undefined,
    serviceId: getParam('serviceId') || '',
    departmentId: getParam('departmentId') || '',
    insuranceCompanyId: getParam('insuranceCompanyId') || '',
    languages: ((): string[] | undefined => {
      const p = getParam('languages');
      return p ? p.split(',') : undefined;
    })(),
    minConsultationFee: ((): number | undefined => {
      const p = getParam('minConsultationFee');
      return p ? Number(p) : undefined;
    })(),
    maxConsultationFee: ((): number | undefined => {
      const p = getParam('maxConsultationFee');
      return p ? Number(p) : undefined;
    })(),
    openNow: getParam('openNow') === 'true' ? true : undefined,
    open24_7: getParam('open24_7') === 'true' ? true : undefined,
    onsitePharmacy: getParam('onsitePharmacy') === 'true' ? true : undefined,
    onsiteLabs: getParam('onsiteLabs') === 'true' ? true : undefined,
    ambulanceServices: getParam('ambulanceServices') === 'true' ? true : undefined,
  });

  const canLoadMorePages = (): boolean => {
    if (!queryParameters?.page || !paginationData) {
      return false;
    }
    return queryParameters.page < paginationData.totalPages;
  };

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      const canLoadMore = target.isIntersecting && canLoadMorePages() && !isLoading;

      if (canLoadMore) {
        setQueryParameters((prev) => ({
          ...prev,
          page: (prev.page ?? 0) + 1,
        }));
      }
    },
    [paginationData, queryParameters, isLoading],
  );

  useEffect(() => {
    async function allHospitals(): Promise<void> {
      setIsLoading(true);
      const { payload } = await dispatch(getAllHospitals(queryParameters));

      if (payload && showErrorToast(payload)) {
        toast(payload);
        setIsLoading(false);
        return;
      }
      const { rows, ...pagination } = payload as IPagination<IHospitalListItem>;
      setHospitals((prev) => (queryParameters.page === 1 ? rows : [...prev, ...rows]));
      setPaginationData(pagination);
      setIsLoading(false);
    }

    void allHospitals();
  }, [queryParameters, dispatch]);

  useEffect(() => {
    const handleScroll = (): void => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight;
      const isAtTop = window.scrollY === 0;

      setShowScrollToTop(isAtBottom ? true : !isAtTop);
    };

    window.addEventListener('scroll', handleScroll);
    return (): void => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!observerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(observerCallback, { threshold: 1 });
    observer.observe(observerRef.current);

    return (): void => observer.disconnect();
  }, [observerRef.current, observerCallback]);

  function handleSubmit(event: FormEvent<HTMLFormElement>, search?: string): void {
    event.preventDefault();
    setHospitals([]);
    setQueryParameters((prev) => ({
      ...prev,
      page: 1,
      search: search ?? searchTerm,
    }));
  }

  function scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowScrollToTop(false);
  }

  const handleFilterChange = (filters: {
    city?: string;
    nearMe?: boolean;
    organizationType?: string;
    hasEmergency?: boolean;
    telemedicine?: boolean;
    serviceId?: string;
    departmentId?: string;
    insuranceCompanyId?: string;
    languages?: string[];
    minConsultationFee?: number;
    maxConsultationFee?: number;
    openNow?: boolean;
    open24_7?: boolean;
    onsitePharmacy?: boolean;
    onsiteLabs?: boolean;
    ambulanceServices?: boolean;
  }): void => {
    setHospitals([]);
    setQueryParameters((prev) => ({
      ...prev,
      ...filters,
      page: 1,
    }));
  };

  const handleResetFilters = (): void => {
    setHospitals([]);
    setQueryParameters((prev) => ({
      ...prev,
      city: '',
      nearMe: undefined,
      organizationType: '',
      hasEmergency: undefined,
      telemedicine: undefined,
      serviceId: '',
      departmentId: '',
      insuranceCompanyId: '',
      languages: undefined,
      minConsultationFee: undefined,
      maxConsultationFee: undefined,
      openNow: undefined,
      open24_7: undefined,
      onsitePharmacy: undefined,
      onsiteLabs: undefined,
      ambulanceServices: undefined,
      page: 1,
    }));
  };

  const stickyBarClass =
    mode === 'dashboard'
      ? 'bg-grayscale-100 sticky top-0 z-40 -mx-4 mb-4 px-4 pt-2 pb-2 sm:mb-6 2xl:-mx-6 2xl:px-6'
      : 'sticky top-0 z-40 mb-4';

  const listContent = (
    <>
      <section className="mb-4">
        <p className="text-2xl font-bold md:text-[32px]">Find Hospitals</p>
      </section>

      <div className={stickyBarClass}>
        <div className="flex w-full flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <form className="flex flex-1 gap-2" onSubmit={handleSubmit}>
              <Input
                error=""
                placeholder="Search hospitals by name, specialty, or location..."
                className="w-full"
                type="search"
                leftIcon={<Search className="text-gray-500" size={20} />}
                onChange={handleSearch}
                defaultMaxWidth={false}
              />
              {searchTerm && <Button type="submit" variant="default" child={<SendHorizontal />} />}
            </form>

            <div className="flex items-center gap-2">
              <HospitalFilters
                queryParameters={queryParameters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                totalResults={paginationData?.total}
              />
            </div>
          </div>

          {paginationData && paginationData.total >= 0 && !isLoading && (
            <div className="mt-3 flex items-center gap-2 border-t border-gray-200 pt-3 text-sm text-gray-600">
              <span className="text-primary font-semibold">
                {paginationData.total} {paginationData.total === 1 ? 'Hospital' : 'Hospitals'}
              </span>
              <span>available</span>
              {queryParameters.search && <span>matching &quot;{queryParameters.search}&quot;</span>}
            </div>
          )}
        </div>
      </div>

      {((): JSX.Element | null => {
        if (isLoading) {
          const skeletonKeys = ['sk1', 'sk2', 'sk3', 'sk4', 'sk5', 'sk6', 'sk7', 'sk8'];
          return (
            <div className={HOSPITAL_GRID_CLASS}>
              {skeletonKeys.map((key) => (
                <SkeletonDoctorPatientCard key={key} className="w-full" />
              ))}
            </div>
          );
        }
        if (hospitals.length > 0) {
          return (
            <div className={HOSPITAL_GRID_CLASS}>
              {hospitals.map((hospital) => (
                <HospitalCard key={hospital.id} hospital={hospital} mode={mode} />
              ))}
            </div>
          );
        }
        return (
          <section>
            <Image
              src={NotFound}
              alt="Not Found"
              width={100}
              height={100}
              className="m-auto h-[60vh] w-[60vw]"
            />
            <p className="mt-4 text-center text-lg md:text-xl"> Sorry nothing to find here </p>
          </section>
        );
      })()}

      <button
        onClick={scrollToTop}
        className={`bg-primary fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-opacity ${
          showScrollToTop ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ChevronUp size={24} />
      </button>
      <div ref={observerRef} className="h-10" />
    </>
  );

  if (mode === 'public') {
    return <PublicHospitalShell>{listContent}</PublicHospitalShell>;
  }

  return <div>{listContent}</div>;
};

export default HospitalListView;
