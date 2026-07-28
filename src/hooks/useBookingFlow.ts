'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import {
  useForm,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { bookingSchema } from '@/schemas/booking.schema';
import { IBookingForm } from '@/types/booking.interface';
import { MODE } from '@/constants/constants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectUser } from '@/lib/features/auth/authSelector';
import { Role } from '@/types/shared.enum';
import { initiatePayment } from '@/lib/features/payments/paymentsThunk';
import { ICheckout } from '@/types/payment.interface';
import { showErrorToast } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { IBookingProvider } from '@/types/bookingProvider.interface';
import { LocalStorageManager } from '@/lib/localStorage';

interface UseBookingFlowParams {
  provider: IBookingProvider;
}

export interface UseBookingFlowReturn {
  showSlots: boolean;
  setShowSlots: Dispatch<SetStateAction<boolean>>;
  showPreview: boolean;
  setShowPreview: Dispatch<SetStateAction<boolean>>;
  isInitiatingPayment: boolean;
  register: UseFormRegister<IBookingForm>;
  setValue: UseFormSetValue<IBookingForm>;
  getValues: UseFormGetValues<IBookingForm>;
  watch: UseFormWatch<IBookingForm>;
  handleContinueBooking: () => void;
  handleConfirmAndPay: () => Promise<void>;
}

export const useBookingFlow = ({ provider }: UseBookingFlowParams): UseBookingFlowReturn => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectUser);

  const [showSlots, setShowSlots] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);

  const { register, setValue, getValues, watch } = useForm<IBookingForm>({
    resolver: zodResolver(bookingSchema),
    mode: MODE.ON_TOUCH,
    defaultValues: { isFollowUp: false, time: '', slotId: '' },
  });

  const handleContinueBooking = (): void => {
    const { slotId, date, time } = getValues();
    if (!slotId || !date || !time) {
      toast({
        title: 'Please select a time slot',
        description: 'You need to select a date and time before proceeding',
      });
      return;
    }
    if (user) {
      if (user.role !== Role.Patient) {
        toast({
          title: 'Please use a patient account',
          description: 'Only patients can book appointments',
        });
        return;
      }
      setShowSlots(false);
      setShowPreview(true);
      return;
    }

    if (provider.type === 'hospital') {
      LocalStorageManager.saveRedirectUrl(
        globalThis.location.pathname + globalThis.location.search,
      );
      router.push(
        `/sign-up?hospitalId=${provider.id}&slotId=${slotId}&hospital=${encodeURIComponent(provider.name)}`,
      );
      return;
    }

    router.push(
      `/sign-up?doctorId=${provider.id}&slotId=${slotId}&doctor=${encodeURIComponent(provider.name)}`,
    );
  };

  const handleConfirmAndPay = async (): Promise<void> => {
    const { slotId, isFollowUp } = getValues();
    setIsInitiatingPayment(true);
    const reason = provider.type === 'hospital' ? 'Hospital appointment' : 'Consultation';
    const { payload } = await dispatch(
      initiatePayment({ additionalInfo: '', reason, slotId, isFollowUp }),
    );
    if (payload && showErrorToast(payload)) {
      toast(payload);
      setIsInitiatingPayment(false);
      setShowPreview(false);
      return;
    }
    const { authorization_url } = payload as ICheckout;
    globalThis.location.replace(authorization_url);
  };

  return {
    showSlots,
    setShowSlots,
    showPreview,
    setShowPreview,
    isInitiatingPayment,
    register,
    setValue,
    getValues,
    watch,
    handleContinueBooking,
    handleConfirmAndPay,
  };
};
