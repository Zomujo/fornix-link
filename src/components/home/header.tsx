'use client';
import Image from 'next/image';
import Link from 'next/link';
import { JSX, useEffect, useState } from 'react';
import { Logo } from '@/assets/images';
import { Navigation } from '@/components/home/navigation';
import { BRANDING } from '@/constants/branding.constant';
import { useQueryParam } from '@/hooks/useQueryParam';

const Header = (): JSX.Element => {
  const [scrolled, setScrolled] = useState(false);
  const { hasSearchParams } = useQueryParam();

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    // Check initial scroll position
    setScrolled(window.scrollY > 10);
    return (): void => window.removeEventListener('scroll', onScroll);
  }, []);

  // When viewing search results, we always want a solid header
  const isSolid = scrolled || hasSearchParams;

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 py-3 transition-all duration-300 sm:px-6 md:px-10 ${
        isSolid ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image
          src={Logo}
          alt="Fornix Link logo"
          width={32}
          height={32}
          className="sm:h-[36px] sm:w-[36px]"
        />
        <span
          className={`text-[15px] font-bold tracking-tight whitespace-nowrap transition-colors duration-300 sm:text-[17px] ${
            isSolid ? 'text-slate-900' : 'text-white'
          }`}
        >
          {BRANDING.APP_NAME}
        </span>
      </Link>
      <Navigation isSolid={isSolid} />
    </header>
  );
};

export default Header;
