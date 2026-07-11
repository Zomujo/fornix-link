'use client';
import Link from 'next/link';
import { JSX } from 'react';
import { useQueryParam } from '@/hooks/useQueryParam';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectUser, selectUserProfilePicture } from '@/lib/features/auth/authSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AvatarComp } from '@/components/ui/avatar';
import { logout } from '@/lib/features/auth/authThunk';
import { useRouter } from 'next/navigation';

export const Navigation = (): JSX.Element => {
  const { hasSearchParams } = useQueryParam();
  const user = useAppSelector(selectUser);
  const profileImage = useAppSelector(selectUserProfilePicture);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logoutHandler = async (): Promise<void> => {
    await dispatch(logout());
    router.refresh();
  };

  return (
    <nav className="flex items-center gap-1">
      <Link
        href="/for-providers"
        className={cn(
          'rounded-md px-4 py-2 text-sm font-medium transition-colors',
          hasSearchParams
            ? 'text-slate-600 hover:text-slate-900'
            : 'text-slate-600 hover:text-slate-900',
        )}
      >
        For Providers
      </Link>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-2 h-9 w-9 overflow-hidden rounded-full">
              <AvatarComp
                imageSrc={profileImage}
                name={`${user.firstName} ${user.lastName}`}
                className="h-9 w-9 text-sm"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push('/dashboard')}>
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logoutHandler}>
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="bg-primary ml-1 rounded-md px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Sign up
          </Link>
        </>
      )}
    </nav>
  );
};
