'use client';

import React, { Dispatch, JSX, SetStateAction } from 'react';
import { Modal } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AvailableDates from '@/app/dashboard/(patient)/book-appointment/[appointment]/_component/availableDates';
import { AvatarComp } from '@/components/ui/avatar';
import { capitalize, pesewasToGhc } from '@/lib/utils';
import moment from 'moment';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Calendar, Clock, Medal } from 'lucide-react';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IBookingForm } from '@/types/booking.interface';
import { IBookingProvider } from '@/types/bookingProvider.interface';
import Image from 'next/image';

import { SERVICE_CHARGE_PERCENTAGE } from '@/constants/payment.constants';

interface BookingModalsProps {
  showSlots: boolean;
  setShowSlots: Dispatch<SetStateAction<boolean>>;
  showPreview: boolean;
  setShowPreview: Dispatch<SetStateAction<boolean>>;
  isInitiatingPayment: boolean;
  provider: IBookingProvider;
  register: UseFormRegister<IBookingForm>;
  setValue: UseFormSetValue<IBookingForm>;
  watch: UseFormWatch<IBookingForm>;
  handleContinueBooking: () => void;
  handleConfirmAndPay: () => void;
}

function ProviderHeader({ provider }: { provider: IBookingProvider }): JSX.Element {
  if (provider.type === 'hospital') {
    return (
      <div className="flex gap-4">
        {provider.image ? (
          <Image
            src={provider.image}
            alt={provider.name}
            width={80}
            height={80}
            className="h-20 w-20 rounded-lg object-cover"
          />
        ) : (
          <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-lg">
            <Building2 size={32} className="text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold text-gray-900 md:text-xl">{provider.name}</h2>
          {provider.subtitle && (
            <p className="text-primary-600 text-sm font-medium capitalize md:text-base">
              {provider.subtitle.replace('_', ' ')}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <AvatarComp imageSrc={provider.image ?? undefined} name={provider.name} className="h-20 w-20" />
      <div>
        <h2 className="text-lg font-bold text-gray-900 md:text-xl">Dr. {provider.name}</h2>
        <p className="text-primary-600 text-sm font-medium md:text-base">
          {provider.subtitle ? capitalize(provider.subtitle) : 'General Practitioner'}
        </p>
      </div>
    </div>
  );
}

export default function BookingModals({
  showSlots,
  setShowSlots,
  showPreview,
  setShowPreview,
  isInitiatingPayment,
  provider,
  register,
  setValue,
  watch,
  handleContinueBooking,
  handleConfirmAndPay,
}: Readonly<BookingModalsProps>): JSX.Element {
  const consultationFee = pesewasToGhc(provider.fee);
  const serviceCharge = parseFloat(
    ((consultationFee * SERVICE_CHARGE_PERCENTAGE) / 100).toFixed(2),
  );
  const isHospital = provider.type === 'hospital';

  return (
    <>
      <Modal
        className="max-h-[95vh] max-w-xl overflow-y-auto p-5"
        setState={setShowSlots}
        open={showSlots}
        content={
          <div className="mt-5">
            <ProviderHeader provider={provider} />
            <div className="mt-8">
              <span className="text-base font-semibold md:text-lg">Available Appointments</span>
              <div className="mt-4 max-h-[45vh] overflow-y-auto">
                <AvailableDates
                  doctorId={isHospital ? undefined : provider.id}
                  hospitalId={isHospital ? provider.id : undefined}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
              </div>
            </div>
          </div>
        }
        footer={
          <div className="mt-4 ml-auto flex justify-end gap-x-4">
            <Button
              onClick={() => setShowSlots(false)}
              variant="outline"
              className="mr-3"
              child="Close"
              disabled={isInitiatingPayment}
            />
            <Button
              onClick={handleContinueBooking}
              child="Continue"
              disabled={!watch('slotId') || isInitiatingPayment}
            />
          </div>
        }
        title="Book an appointment"
        showClose={true}
      />

      <Modal
        className="max-h-[95vh] max-w-xl overflow-y-auto p-5"
        setState={(value) => {
          if (!isInitiatingPayment) {
            setShowPreview(value);
          }
        }}
        open={showPreview}
        content={
          <div className="mt-5">
            {isInitiatingPayment && (
              <div className="mb-4 flex items-center justify-center rounded-lg bg-blue-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  <p className="text-sm font-medium text-blue-700">
                    Processing payment... Redirecting to Payment Service
                  </p>
                </div>
              </div>
            )}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Appointment Preview</h3>
              <div className="space-y-4">
                <ProviderHeader provider={provider} />

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar size={20} className="text-primary-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Appointment Date</p>
                        <p className="text-base font-semibold text-gray-900">
                          {watch('date')
                            ? moment(watch('date')).format('dddd, MMMM Do, YYYY')
                            : 'Not selected'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-primary-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Appointment Time</p>
                        <p className="text-base font-semibold text-gray-900">
                          {watch('time') || 'Not selected'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Medal size={20} className="text-primary-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Session Duration</p>
                        <p className="text-base font-semibold text-gray-900">45 minutes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {!isHospital && (
                  <label
                    htmlFor="isFollowUp"
                    className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-4"
                  >
                    <Checkbox
                      id="isFollowUp"
                      checked={watch('isFollowUp')}
                      onCheckedChange={(checked) => setValue('isFollowUp', checked === true)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <span className="text-sm leading-none font-semibold text-gray-900">
                        This is a follow-up consultation
                      </span>
                      <p className="text-xs text-gray-500">
                        Check this if you have seen this doctor before for the same health concern.
                      </p>
                    </div>
                  </label>
                )}

                <div className="border-primary-200 bg-primary-50 rounded-lg border p-4">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Payment Summary</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {isHospital ? 'Appointment Fee' : 'Consultation Fee'}
                      </span>
                      <span className="font-medium text-gray-900">
                        GHS {consultationFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        Service Charge{' '}
                        <span
                          className="inline-flex h-4 w-4 cursor-default items-center justify-center rounded-full bg-gray-300 text-[10px] font-bold text-gray-600"
                          title={`A ${SERVICE_CHARGE_PERCENTAGE}% platform service and tax fee applied to every booking.`}
                        >
                          ?
                        </span>
                      </span>
                      <span className="font-medium text-gray-900">
                        GHS {serviceCharge.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">Total</span>
                        <span className="text-primary-600 text-xl font-bold">
                          GHS {(consultationFee + serviceCharge).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Includes a {SERVICE_CHARGE_PERCENTAGE}% (GHS {serviceCharge.toFixed(2)}) service
                    fee charged by the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
        footer={
          <div className="mt-4 ml-auto flex justify-end gap-x-4">
            <Button
              onClick={() => {
                if (!isInitiatingPayment) {
                  setShowPreview(false);
                  setShowSlots(true);
                }
              }}
              variant="outline"
              child="Back"
              disabled={isInitiatingPayment}
            />
            <Button
              isLoading={isInitiatingPayment}
              onClick={() => handleConfirmAndPay()}
              child="Confirm & Pay"
              disabled={isInitiatingPayment}
            />
          </div>
        }
        title="Confirm Appointment"
        showClose={true}
      />
    </>
  );
}
