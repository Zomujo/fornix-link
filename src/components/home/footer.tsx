import Link from 'next/link';
import { JSX } from 'react';
import { BRANDING } from '@/constants/branding.constant';
import { Shield, FileText } from 'lucide-react';

const Footer = (): JSX.Element => {
  const footerSections = [
    {
      title: 'For Patients',
      links: [
        { label: 'Find Doctors', href: '/find-doctors' },
        { label: 'Find Specialists', href: '/find-specialists' },
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
      ],
    },
    {
      title: 'For Providers',
      links: [
        { label: 'Provider Solutions', href: '/for-providers' },
        { label: 'For Hospitals', href: '/for-providers#hospitals' },
        { label: 'Find Hospitals', href: '/find-hospitals' },
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
    <footer className="border-t border-white/10 bg-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start justify-between space-y-8 md:flex-row md:space-y-0">
          <div className="flex flex-col gap-2">
            <h3 className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-xl font-black tracking-tight text-transparent">
              {BRANDING.APP_NAME}
            </h3>
            <p className="text-sm font-medium text-slate-400">{BRANDING.SLOGAN}</p>
            <p className="text-xs italic text-slate-500">{BRANDING.APP_TAGLINE}</p>
          </div>

          <div className="flex flex-col space-y-8 md:flex-row md:space-x-16 md:space-y-0">
            {footerSections.map(({ links, title }) => (
              <div key={title}>
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-300">
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-slate-500 transition-colors hover:text-teal-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-600">
              &copy; {new Date().getFullYear()} {BRANDING.COPYRIGHT_HOLDER}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/privacy-policy"
                className="flex items-center gap-1.5 text-slate-600 transition-colors hover:text-teal-400"
              >
                <Shield className="h-3.5 w-3.5" />
                Privacy Policy
              </Link>
              <span className="text-slate-700">·</span>
              <Link
                href="/terms-conditions"
                className="flex items-center gap-1.5 text-slate-600 transition-colors hover:text-teal-400"
              >
                <FileText className="h-3.5 w-3.5" />
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
