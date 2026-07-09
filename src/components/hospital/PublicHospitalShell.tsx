'use client';

import Link from 'next/link';
import Image from 'next/image';
import { JSX, ReactNode } from 'react';
import { Logo } from '@/assets/images';
import { BRANDING } from '@/constants/branding.constant';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/hooks';
import { selectIsPatient, selectUser } from '@/lib/features/auth/authSelector';

interface PublicHospitalShellProps {
  children: ReactNode;
}

export function PublicHospitalShell({ children }: Readonly<PublicHospitalShellProps>): JSX.Element {
  const user = useAppSelector(selectUser);
  const isPatient = useAppSelector(selectIsPatient);

  const getNavButtons = (): JSX.Element => {
    if (user) {
      if (isPatient) {
        return (
          <Link href="/dashboard/find-hospitals">
            <Button child="View in Dashboard" />
          </Link>
        );
      }
      return <></>;
    }
    return (
      <>
        <Link href="/login">
          <Button variant="outline" child="Log In" />
        </Link>
        <Link href="/sign-up">
          <Button child="Sign Up" />
        </Link>
      </>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-9 w-28">
            <Image src={Logo} alt={BRANDING.APP_NAME} fill className="object-contain" />
          </div>
        </Link>
        <div className="flex items-center gap-2">{getNavButtons()}</div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6">{children}</main>

      <footer className="mt-auto border-t bg-white py-6 text-center text-sm text-gray-400">
        <p>
          Powered by{' '}
          <Link href="/" className="text-primary font-semibold">
            {BRANDING.APP_NAME}
          </Link>{' '}
          · {BRANDING.SLOGAN}
        </p>
      </footer>
    </div>
  );
}
