import { Dispatch, SetStateAction } from 'react';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

export interface IInitializeAppointment {
  slotId: string;
  reason: string;
  additionalInfo: string;
  isFollowUp: boolean;
}

export interface IBookingFormBase {
  date: string;
  reason: string;
  appointmentType: string;
  additionalInfo: string;
  isFollowUp: boolean;
}

export interface IBookingForm extends IBookingFormBase {
  time: string;
  slotId: string;
}

export interface IHospitalBookingForm extends IBookingFormBase {}

export type IBookingSlotId = Pick<IBookingForm, 'slotId'>;

export type AvailabilityProps = {
  doctorId?: string;
  register: UseFormRegister<IBookingForm>;
  setValue: UseFormSetValue<IBookingForm>;
  setCurrentStep?: Dispatch<SetStateAction<number>>;
  isValid?: boolean;
  watch: UseFormWatch<IBookingForm>;
  errors?: FieldErrors<IBookingForm>;
  onNoSlotsFound?: () => void;
};
