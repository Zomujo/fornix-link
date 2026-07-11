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
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // When viewing search results, we always want a solid header
  const isSolid = scrolled || hasSearchParams;

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 md:px-10 ${
        isSolid ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <Image src={Logo} alt="Fornix Link logo" width={36} height={36} />
        <span
          className={`text-[17px] font-bold tracking-tight transition-colors duration-300 ${
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
