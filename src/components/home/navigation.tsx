'use client';
import Link from 'next/link';
import { JSX } from 'react';
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

interface NavigationProps {
  isSolid?: boolean;
}

export const Navigation = ({ isSolid = true }: NavigationProps): JSX.Element => {
  const user = useAppSelector(selectUser);
  const profileImage = useAppSelector(selectUserProfilePicture);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logoutHandler = async (): Promise<void> => {
    await dispatch(logout());
    router.refresh();
  };

  return (
    <nav className="flex items-center gap-2">
      <Link
        href="/for-providers"
        className={cn(
          'group relative px-4 py-2 text-sm font-semibold transition-colors duration-300',
          isSolid ? 'text-slate-600 hover:text-teal-700' : 'text-white/90 hover:text-white',
        )}
      >
        <span className="relative z-10">For Providers</span>
        <span
          className={cn(
            'absolute inset-0 scale-75 rounded-full opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100',
            isSolid ? 'bg-teal-50' : 'bg-white/20 backdrop-blur-md',
          )}
        />
      </Link>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'ml-2 h-10 w-10 overflow-hidden rounded-full border-2 transition-all duration-300 hover:scale-105 hover:shadow-md',
                isSolid ? 'border-slate-200 hover:border-teal-400' : 'border-white/20 hover:border-white/60',
              )}
            >
              <AvatarComp
                imageSrc={profileImage}
                name={`${user.firstName} ${user.lastName}`}
                className="h-full w-full text-sm"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl shadow-xl">
            <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer font-medium hover:bg-slate-50">
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logoutHandler} className="cursor-pointer font-medium text-red-600 hover:bg-red-50 hover:text-red-700">
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-1 pl-2">
          <Link
            href="/login"
            className={cn(
              'group relative px-5 py-2.5 text-sm font-semibold transition-colors duration-300',
              isSolid ? 'text-slate-600 hover:text-teal-700' : 'text-white/90 hover:text-white',
            )}
          >
            <span className="relative z-10">Log in</span>
            <span
              className={cn(
                'absolute inset-0 scale-75 rounded-full opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100',
                isSolid ? 'bg-teal-50' : 'bg-white/20 backdrop-blur-md',
              )}
            />
          </Link>
          <Link
            href="/sign-up"
            className={cn(
              'relative ml-1 overflow-hidden rounded-full px-6 py-2.5 text-sm font-bold shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
              isSolid
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-teal-500/25'
                : 'bg-white text-teal-800 hover:bg-white hover:shadow-white/30 hover:ring-2 hover:ring-white/50 hover:ring-offset-1 hover:ring-offset-transparent',
            )}
          >
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
};
