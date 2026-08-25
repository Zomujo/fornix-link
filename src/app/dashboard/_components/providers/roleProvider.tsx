'use client';

import { selectUserRole } from '@/lib/features/auth/authSelector';
import { useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { JSX, ReactNode, useEffect } from 'react';
import { Role } from '@/types/shared.enum';

export function RoleProvider({
  children,
  role,
}: Readonly<{ children: ReactNode; role: Role | Role[] }>): JSX.Element {
  const userRole = useAppSelector(selectUserRole);
  const router = useRouter();
  const allowedRolesKey = (Array.isArray(role) ? role : [role]).join(',');

  useEffect(() => {
    const allowedRoles = allowedRolesKey.split(',') as Role[];
    if (userRole && !allowedRoles.includes(userRole)) {
      router.push('/dashboard');
    }
  }, [allowedRolesKey, router, userRole]);

  return <>{children}</>;
}
