'use client';
import { Calendar } from '@/components/ui/calendar';
import { cn, showErrorToast } from '@/lib/utils';
import { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { useParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { AvailabilityProps } from '@/types/booking.interface';
import { extractGMTTime } from '@/lib/date';
import {
  getAppointmentSlotsByDate,
  getAppointmentSlotsDates,
} from '@/lib/features/appointments/appointmentsThunk';
import { IPagination } from '@/types/shared.interface';
import { MedicalAppointmentType, useQueryParam } from '@/hooks/useQueryParam';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ListView from './listView';
import LoadingOverlay from '@/components/loadingOverlay/loadingOverlay';
import { AppointmentDate, AppointmentSlots, SlotStatus } from '@/types/slots.interface';

const AvailableDates = ({
  setValue,
  watch,
  doctorId,
  hospitalId,
  isHospitalAppointment: isHospitalAppointmentProp,
  onNoSlotsFound,
}: AvailabilityProps & { isHospitalAppointment?: boolean }): JSX.Element => {
  const date = watch('date');
  const selectedTime = watch('time');
  const dispatch = useAppDispatch();
  const params = useParams();
  const id = params.appointment as string | undefined;
  const { getQueryParam } = useQueryParam();
  const appointmentType = getQueryParam('appointmentType');

  const resolvedHospitalId = useMemo(
    () => hospitalId ?? (appointmentType === MedicalAppointmentType.Hospital ? id : undefined),
    [hospitalId, appointmentType, id],
  );
  const resolvedDoctorId = useMemo(
    () => doctorId ?? (appointmentType === MedicalAppointmentType.Doctor ? id : undefined),
    [doctorId, appointmentType, id],
  );
  const isHospitalAppointment = isHospitalAppointmentProp ?? !!resolvedHospitalId;

  const [availableTimeSlots, setAvailableTimeSlots] = useState<AppointmentSlots[]>([]);
  const [isAvailableSlotLoading, setIsAvailableSlotLoading] = useState(false);
  const [isLoadingAppointmentDates, setIsLoadingAppointmentDates] = useState(false);
  const [canBookDates, setCanBookDates] = useState<Date[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const timeSlotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadBookableDates(): Promise<void> {
      if (!resolvedDoctorId && !resolvedHospitalId) {
        return;
      }

      setIsLoadingAppointmentDates(true);
      const lastDateOfTheMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const { payload } = await dispatch(
        getAppointmentSlotsDates({
          startDate: currentDate,
          endDate: lastDateOfTheMonth,
          doctorId: resolvedDoctorId || '',
          hospitalId: resolvedHospitalId || '',
          pageSize: 35,
          page: 1,
          status: SlotStatus.Available,
        }),
      );

      if (payload && showErrorToast(payload)) {
        toast(payload);
        setIsLoadingAppointmentDates(false);
        return;
      }
      const { rows } = payload as IPagination<AppointmentDate>;
      const dates = rows.map(({ date }) => new Date(date));

      setCanBookDates(dates);
      if (dates.length === 0) {
        onNoSlotsFound?.();
      }
      setIsLoadingAppointmentDates(false);
    }

    void loadBookableDates();
  }, [currentDate, resolvedDoctorId, resolvedHospitalId, dispatch, onNoSlotsFound]);

  useEffect(() => {
    async function loadTimeSlotsForSelectedDate(): Promise<void> {
      if (!resolvedDoctorId && !resolvedHospitalId) {
        return;
      }

      setAvailableTimeSlots([]);
      setIsAvailableSlotLoading(true);
      const { payload } = await dispatch(
        getAppointmentSlotsByDate({
          date: new Date(date || new Date()).toISOString(),
          doctorId: resolvedDoctorId || '',
          hospitalId: resolvedHospitalId || '',
        }),
      );

      if (payload && showErrorToast(payload)) {
        toast(payload);
        setIsAvailableSlotLoading(false);
        return;
      }
      const data = payload as AppointmentSlots[];
      if (data) {
        const availableSlots: AppointmentSlots[] = data.map(({ startTime, ...rest }) => ({
          ...rest,
          startTime: `${extractGMTTime(startTime)}`,
        }));
        setAvailableTimeSlots(availableSlots);
      } else {
        setAvailableTimeSlots([]);
      }
      setIsAvailableSlotLoading(false);
    }

    void loadTimeSlotsForSelectedDate();
  }, [date, resolvedDoctorId, resolvedHospitalId, dispatch]);

  useEffect(() => {
    if (!isAvailableSlotLoading && date && timeSlotsRef.current) {
      setTimeout(() => {
        timeSlotsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 100);
    }
  }, [isAvailableSlotLoading, date]);

  const handleSlotSelection = (startTime: string, slotId: string): void => {
    setValue('time', startTime, {
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue('slotId', slotId, {
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="rounded-md border p-8">
      <div>
        <p className="pb-8 text-left text-xl font-bold"> Choose available Date & Time</p>
      </div>
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <div className="relative">
            {isLoadingAppointmentDates && <LoadingOverlay />}
            <Calendar
              showOutsideDays={false}
              onMonthChange={(month) => setCurrentDate(month)}
              dayButtonClassName="cursor-pointer"
              modifiers={{
                canBook: canBookDates,
              }}
              modifiersClassNames={{
                canBook: 'bg-gray-200 rounded-md font-semibold',
              }}
              mode="single"
              selected={new Date(date || new Date())}
              onSelect={(selected) => {
                if (selected) {
                  setValue('date', selected.toISOString(), {
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }
              }}
              className="mx-auto w-full rounded-md border"
              disabled={{ before: new Date() }}
            />
          </div>

          <div ref={timeSlotsRef}>
            <p className="mt-5 mb-2 font-medium">Available time (Africa/Accra - GMT (+00:00))</p>
            {!!availableTimeSlots.length && (
              <small className="m-auto text-center text-red-500">*Each session is 45 minutes </small>
            )}
            <div className="flex flex-wrap gap-3">
              {!!availableTimeSlots.length &&
                availableTimeSlots.map(({ startTime, id: slotId }) => (
                  <button
                    key={slotId}
                    type="button"
                    className={cn(
                      'w-max cursor-pointer rounded-sm border p-1 font-medium text-gray-500',
                      selectedTime === startTime && 'border-primary text-primary',
                    )}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleSlotSelection(startTime, slotId);
                    }}
                  >
                    {startTime}
                  </button>
                ))}
              {!availableTimeSlots.length && !isAvailableSlotLoading && date && (
                <div className="text-sm text-gray-600">
                  No open times on this date. Try another day, or check back later if none are
                  listed.
                </div>
              )}
            </div>
          </div>

          {isAvailableSlotLoading && (
            <div className="flex gap-2">
              {new Array(5).map((num, index) => (
                <div
                  key={`${index}-${num}`}
                  className={cn('h-8 w-16 animate-pulse rounded-sm border bg-gray-200')}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="list">
          <ListView
            setValue={setValue}
            watch={watch}
            doctorId={resolvedDoctorId}
            hospitalId={resolvedHospitalId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AvailableDates;
