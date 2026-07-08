'use client';

import React, { JSX } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface HospitalBookingLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceed: () => void;
}

const HospitalBookingLoginDialog = ({
  open,
  onOpenChange,
  onProceed,
}: HospitalBookingLoginDialogProps): JSX.Element => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showClose>
        <DialogHeader>
          <div className="bg-primary-light mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <LogIn className="text-primary h-6 w-6" />
          </div>
          <DialogTitle className="text-center">Log in to book an appointment</DialogTitle>
          <DialogDescription className="text-center">
            You need to be logged in to request an appointment with this hospital. Log in to
            continue, or stay on this page to keep browsing.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            child="Stay"
          />
          <Button type="button" onClick={onProceed} child="Log In" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HospitalBookingLoginDialog;
