'use client';

import { JSX, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { useQueryParam, MedicalAppointmentType } from '@/hooks/useQueryParam';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getAppointmentSlotsDates } from '@/lib/features/appointments/appointmentsThunk';
import { IPagination } from '@/types/shared.interface';
import { showErrorToast } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { AvailabilityProps } from '@/types/booking.interface';
import DateSlots from './DateSlots';
import { DateAppointmentSlots, SlotStatus } from '@/types/slots.interface';

type ListViewProps = Pick<AvailabilityProps, 'setValue' | 'watch' | 'doctorId' | 'hospitalId'>;

type AppointmentDate = Pick<DateAppointmentSlots, 'date'>;

const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

const ListView = ({ setValue, watch, doctorId, hospitalId }: ListViewProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const id = params.appointment as string;
  const { getQueryParam } = useQueryParam();
  const appointmentType = getQueryParam('appointmentType');

  const [dates, setDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const lastDateElementRef = useInfiniteScroll({
    isLoading,
    hasMore,
    onLoadMore: () => setPage((prev) => prev + 1),
  });

  const updateDates = (appointmentDates: AppointmentDate[]): void => {
    setDates((prev) => {
      const seen = new Set(prev);
      const next = [...prev];
      for (const { date } of appointmentDates) {
        if (!seen.has(date)) {
          seen.add(date);
          next.push(date);
        }
      }
      return next;
    });
  };

  useEffect(() => {
    const fetchDates = async (): Promise<void> => {
      setIsLoading(true);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + 3); // Fetch for next 3 months

      const { payload } = await dispatch(
        getAppointmentSlotsDates({
          startDate,
          endDate,
          doctorId: doctorId || (appointmentType === MedicalAppointmentType.Doctor ? id : ''),
          hospitalId: hospitalId || (appointmentType === MedicalAppointmentType.Hospital ? id : ''),
          pageSize: 10,
          page,
          status: SlotStatus.Available,
        }),
      );

      if (payload && showErrorToast(payload)) {
        toast(payload);
        setIsLoading(false);
        return;
      }

      const { rows, totalPages } = payload as IPagination<AppointmentDate>;
      updateDates(rows);
      if (page >= totalPages) {
        setHasMore(false);
      }
      setIsLoading(false);
    };

    void fetchDates();
  }, [page]);

  const renderGroupedDates = (): (JSX.Element | null)[] => {
    if (dates.length === 0 && !isLoading) {
      const providerLabel = hospitalId ? 'This hospital' : 'This doctor';
      return [
        <div key={'no-appointments-found'} className="space-y-1 text-sm text-gray-600">
          <p className="font-medium text-gray-800">No booking times available yet</p>
          <p>
            {providerLabel} has not published any open appointment slots. Please check back later or
            try another provider.
          </p>
        </div>,
      ];
    }

    let lastDate: Date | null = null;
    const renderedElements: (JSX.Element | null)[] = [];

    dates.forEach((dateString, index) => {
      const currentDate = new Date(dateString);

      if (lastDate) {
        const diffDays = (currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 1) {
          const startDate = new Date(lastDate);
          startDate.setDate(startDate.getDate() + 1);
          const endDate = new Date(currentDate);
          endDate.setDate(endDate.getDate() - 1);

          renderedElements.push(
            <div key={`no-slot-${dateString}`} className="my-4">
              <p className="font-semibold text-gray-600">
                {formatDate(startDate)} - {formatDate(endDate)}
              </p>
              <p className="text-sm text-gray-500">No open times in this range</p>
            </div>,
          );
        }
      }

      const isLastElement = dates.length === index + 1;
      renderedElements.push(
        <div key={dateString} ref={isLastElement ? lastDateElementRef : null} className="my-4">
          <p className="font-semibold">{formatDate(currentDate)}</p>
          <DateSlots
            date={dateString}
            setValue={setValue}
            watch={watch}
            doctorId={doctorId}
            hospitalId={hospitalId}
          />
        </div>,
      );

      lastDate = currentDate;
    });

    return renderedElements;
  };

  return (
    <div>
      <p className="mt-5 mb-2 font-medium">Available time (Africa/Accra - GMT (+00:00))</p>
      {!!dates.length && (
        <small className="m-auto text-red-500">*Each session is 45 minutes </small>
      )}
      <div className="mt-4">{renderGroupedDates()}</div>
      {isLoading && <p>Loading more dates...</p>}
    </div>
  );
};

export default ListView;
