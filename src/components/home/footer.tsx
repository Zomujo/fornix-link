import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';
import { BRANDING } from '@/constants/branding.constant';
import { Logo } from '@/assets/images';
import { Shield, FileText, ArrowRight } from 'lucide-react';

const Footer = (): JSX.Element => {
  const footerSections = [
    {
      title: 'For Patients',
      links: [
        { label: 'Find Doctors', href: '/find-doctors' },
        { label: 'Find Hospitals', href: '/hospitals' },
        { label: 'Find Specialists', href: '/find-specialists' },
        { label: 'Pricing', href: '/#pricing' },
      ],
    },
    {
      title: 'For Providers',
      links: [
        { label: 'Provider Solutions', href: '/for-providers' },
        { label: 'Hospitals & Clinics', href: '/for-providers#hospitals' },
        { label: 'Doctor Sign Up', href: '/sign-up?role=doctor' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms & Conditions', href: '/terms-conditions' },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-teal-950 pt-20 pb-10 text-teal-100/80">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] translate-y-1/3 rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-5 xl:gap-24 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg">
                <Image src={Logo} alt={`${BRANDING.APP_NAME} logo`} width={32} height={32} className="object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                {BRANDING.APP_NAME}
              </span>
            </Link>
            
            <p className="text-lg text-teal-100/70 font-medium max-w-sm leading-relaxed">
              {BRANDING.SLOGAN}. <br />
              <span className="text-teal-400">{BRANDING.APP_TAGLINE}</span>
            </p>


          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 gap-10 lg:col-span-3 sm:grid-cols-3">
            {footerSections.map(({ links, title }) => (
              <div key={title} className="flex flex-col gap-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-white">
                  {title}
                </h4>
                <ul className="flex flex-col gap-4">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex w-max items-center text-teal-200/60 transition-colors hover:text-white font-medium"
                      >
                        {link.label}
                        <ArrowRight className="ml-2 h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-teal-900/50 pt-8 sm:flex-row">
          <p className="text-sm font-medium text-teal-200/50">
            &copy; {new Date().getFullYear()} {BRANDING.COPYRIGHT_HOLDER}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/privacy-policy"
              className="flex items-center gap-2 text-teal-200/50 transition-colors hover:text-white"
            >
              <Shield className="h-4 w-4" />
              Privacy Policy
            </Link>
            <Link
              href="/terms-conditions"
              className="flex items-center gap-2 text-teal-200/50 transition-colors hover:text-white"
            >
              <FileText className="h-4 w-4" />
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
