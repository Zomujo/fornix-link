'use client';

import { Logo, LoginSlide } from '@/assets/images';
import AuthenticationFrame, { ImagePosition } from '@/app/(auth)/_components/authenticationFrame';
import Text from '@/components/text/text';
import { Button } from '@/components/ui/button';
import { Toast, toast } from '@/hooks/use-toast';
import { selectUser } from '@/lib/features/auth/authSelector';
import {
  acceptHospitalStaffInvite,
  declineHospitalStaffInvite,
  getHospitalStaffInvitePreview,
} from '@/lib/features/hospital-staff/hospitalStaffThunk';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { showErrorToast } from '@/lib/utils';
import { IHospitalStaffInvitePreview } from '@/types/hospital-staff.interface';
import { CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { JSX, Suspense, useEffect, useMemo, useState } from 'react';

type InviteResult = 'accepted' | 'declined' | null;

const InviteLogos = ({
  hospitalName,
  hospitalLogo,
}: {
  hospitalName?: string;
  hospitalLogo?: string | null;
}): JSX.Element => (
  <div className="mb-6 flex items-center justify-center gap-3">
    <Image src={Logo} width={44} height={44} alt="Fornix Link logo" />
    {hospitalLogo ? (
      <>
        <span className="text-grayscale-300 text-lg font-light">|</span>
        <Image
          src={hospitalLogo}
          width={44}
          height={44}
          alt={hospitalName ? `${hospitalName} logo` : 'Hospital logo'}
          className="rounded-md object-contain"
          unoptimized
        />
      </>
    ) : null}
  </div>
);

const StaffInviteContent = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppSelector(selectUser);
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);

  const [isLoadingPreview, setIsLoadingPreview] = useState(!!token);
  const [preview, setPreview] = useState<IHospitalStaffInvitePreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [result, setResult] = useState<InviteResult>(null);

  useEffect(() => {
    if (!token) {
      setIsLoadingPreview(false);
      return;
    }

    let cancelled = false;
    const loadPreview = async (): Promise<void> => {
      setIsLoadingPreview(true);
      setPreviewError(null);
      const { payload } = await dispatch(getHospitalStaffInvitePreview(token));
      if (cancelled) {
        return;
      }
      setIsLoadingPreview(false);
      if (payload && showErrorToast(payload)) {
        setPreview(null);
        const description = (payload as Toast).description;
        setPreviewError(
          typeof description === 'string' && description
            ? description
            : 'This invite is invalid or has expired.',
        );
        return;
      }
      setPreview(payload as IHospitalStaffInvitePreview);
    };

    void loadPreview();
    return (): void => {
      cancelled = true;
    };
  }, [dispatch, token]);

  async function handleAccept(): Promise<void> {
    if (!token) {
      return;
    }
    setIsAccepting(true);
    const { payload } = await dispatch(acceptHospitalStaffInvite(token));
    setIsAccepting(false);
    toast(payload as Toast);
    if (payload && !showErrorToast(payload)) {
      setResult('accepted');
    }
  }

  async function handleDecline(): Promise<void> {
    if (!token) {
      return;
    }
    setIsDeclining(true);
    const { payload } = await dispatch(declineHospitalStaffInvite(token));
    setIsDeclining(false);
    toast(payload as Toast);
    if (payload && !showErrorToast(payload)) {
      setResult('declined');
    }
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <InviteLogos />
        <XCircle className="h-12 w-12 text-red-500" />
        <Text variantStyle="h4" variant="h4">
          Invalid invite link
        </Text>
        <Text variantStyle="body-small" className="text-grayscale-500">
          This staff invite link is missing a token. Ask your hospital admin to resend the invite.
        </Text>
        <Button child="Go to login" onClick={() => router.push('/login')} className="mt-2" />
      </div>
    );
  }

  if (isLoadingPreview) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center">
        <InviteLogos />
        <div className="h-40 w-full animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  if (previewError && !result) {
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <InviteLogos />
        <XCircle className="h-12 w-12 text-red-500" />
        <Text variantStyle="h4" variant="h4">
          Invite unavailable
        </Text>
        <Text variantStyle="body-small" className="text-grayscale-500">
          {previewError}
        </Text>
        <Button child="Go to login" onClick={() => router.push('/login')} className="mt-2" />
      </div>
    );
  }

  const hospitalName = preview?.hospitalName;
  const hospitalLogo = preview?.hospitalLogo;

  if (result === 'accepted') {
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <InviteLogos hospitalName={hospitalName} hospitalLogo={hospitalLogo} />
        <CheckCircle2 className="text-primary h-12 w-12" />
        <Text variantStyle="h4" variant="h4">
          Invite accepted
        </Text>
        <Text variantStyle="body-small" className="text-grayscale-500">
          {hospitalName ? (
            <>
              You are now an active staff member of{' '}
              <strong className="text-gray-900">{hospitalName}</strong>.
            </>
          ) : (
            'You are now an active staff member of this hospital.'
          )}
        </Text>
        {user ? (
          <Button
            child="Go to dashboard"
            onClick={() => router.push('/dashboard')}
            className="mt-2"
          />
        ) : (
          <div className="space-y-2">
            <Text variantStyle="body-small" className="text-grayscale-500">
              Log in with your email and temporary password from the invite email to continue.
            </Text>
            <Button
              child="Log in to continue"
              onClick={() => router.push('/login')}
              className="mt-2"
            />
          </div>
        )}
      </div>
    );
  }

  if (result === 'declined') {
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <InviteLogos hospitalName={hospitalName} hospitalLogo={hospitalLogo} />
        <XCircle className="h-12 w-12 text-gray-400" />
        <Text variantStyle="h4" variant="h4">
          Invite declined
        </Text>
        <Text variantStyle="body-small" className="text-grayscale-500">
          {hospitalName ? (
            <>
              You declined the staff invitation from{' '}
              <strong className="text-gray-900">{hospitalName}</strong>.
            </>
          ) : (
            'You declined this hospital staff invitation.'
          )}
        </Text>
        <Button child="Go to login" onClick={() => router.push('/login')} className="mt-2" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center space-y-6">
      <InviteLogos hospitalName={hospitalName} hospitalLogo={hospitalLogo} />
      <div className="flex flex-col items-center space-y-2 text-center">
        <Text variantStyle="h4" variant="h4">
          Hospital staff invitation
        </Text>
        <Text variantStyle="body-small" className="text-grayscale-500">
          {hospitalName ? (
            <>
              You have been invited to join{' '}
              <strong className="text-gray-900">{hospitalName}</strong> on Fornix Link
              {preview?.role ? (
                <>
                  {' '}
                  as a <strong className="text-gray-900">{preview.role}</strong>
                </>
              ) : null}
              . Accept to activate your staff membership, or decline if this was sent in error.
            </>
          ) : (
            'You have been invited to join a hospital on Fornix Link. Accept to activate your staff membership, or decline if this was sent in error.'
          )}
        </Text>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Button
          child="Accept invite"
          onClick={() => void handleAccept()}
          isLoading={isAccepting}
          disabled={isAccepting || isDeclining}
        />
        <Button
          child="Decline invite"
          variant="destructive"
          onClick={() => void handleDecline()}
          isLoading={isDeclining}
          disabled={isAccepting || isDeclining}
        />
      </div>
      {!user && (
        <Text variantStyle="body-small" className="text-grayscale-500 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium underline">
            Log in
          </Link>
        </Text>
      )}
    </div>
  );
};

const StaffInvitePage = (): JSX.Element => (
  <AuthenticationFrame
    imageSlide={LoginSlide}
    imageAlt="Staff invite"
    imagePosition={ImagePosition.Left}
  >
    <div className="mt-8 flex w-full justify-center">
      <Suspense
        fallback={<div className="h-40 w-full max-w-sm animate-pulse rounded-lg bg-gray-100" />}
      >
        <StaffInviteContent />
      </Suspense>
    </div>
  </AuthenticationFrame>
);

export default StaffInvitePage;
