'use client';

import { selectDoctorMustCompleteOnboarding, selectUser } from '@/lib/features/auth/authSelector';
import { useAppSelector } from '@/lib/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { JSX, ReactNode, useEffect } from 'react';

export function DashboardProvider({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  const user = useAppSelector(selectUser);
  const mustCompleteOnboarding = useAppSelector(selectDoctorMustCompleteOnboarding);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      const doctorProfileMatch = /^\/dashboard\/doctor\/([^/]+)$/.exec(pathname);
      if (doctorProfileMatch) {
        const doctorId = doctorProfileMatch[1];
        router.replace(`/doctor/${doctorId}`);
        return;
      }

      const hospitalListMatch = /^\/dashboard\/find-hospitals\/?$/.exec(pathname);
      if (hospitalListMatch) {
        router.replace('/hospitals');
        return;
      }

      const hospitalDetailMatch = /^\/dashboard\/find-hospitals\/([^/]+)$/.exec(pathname);
      if (hospitalDetailMatch) {
        const slug = hospitalDetailMatch[1];
        router.replace(`/hospitals/${slug}`);
        return;
      }

      router.push('/login');
    }
    if (mustCompleteOnboarding) {
      router.push('/onboarding');
    }
  }, [user, mustCompleteOnboarding, pathname, router]);

  return <>{children}</>;
}
