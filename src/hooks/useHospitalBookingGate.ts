'use client';

import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { selectIsPatient, selectUser } from '@/lib/features/auth/authSelector';
import { LocalStorageManager } from '@/lib/localStorage';

export function useHospitalBookingGate(): {
  loginPromptOpen: boolean;
  setLoginPromptOpen: Dispatch<SetStateAction<boolean>>;
  bookingModalOpen: boolean;
  setBookingModalOpen: Dispatch<SetStateAction<boolean>>;
  requestBooking: () => void;
  proceedToLogin: () => void;
} {
  const user = useAppSelector(selectUser);
  const isPatient = useAppSelector(selectIsPatient);
  const router = useRouter();
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const requestBooking = useCallback((): void => {
    if (!user || !isPatient) {
      setLoginPromptOpen(true);
      return;
    }
    setBookingModalOpen(true);
  }, [user, isPatient]);

  const proceedToLogin = useCallback((): void => {
    LocalStorageManager.saveRedirectUrl(globalThis.location.pathname + globalThis.location.search);
    setLoginPromptOpen(false);
    router.push('/login');
  }, [router]);

  return {
    loginPromptOpen,
    setLoginPromptOpen,
    bookingModalOpen,
    setBookingModalOpen,
    requestBooking,
    proceedToLogin,
  };
}
