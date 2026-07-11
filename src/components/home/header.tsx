'use client';
import Image from 'next/image';
import Link from 'next/link';
import { JSX, useEffect, useState } from 'react';
import { Logo } from '@/assets/images';
import { Navigation } from '@/components/home/navigation';
import { BRANDING } from '@/constants/branding.constant';

const Header = (): JSX.Element => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 md:px-10 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-white'
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <Image src={Logo} alt="Fornix Link logo" width={36} height={36} />
        <span className="text-[17px] font-bold tracking-tight text-slate-900">
          {BRANDING.APP_NAME}
        </span>
      </Link>
      <Navigation />
    </header>
  );
};

export default Header;
