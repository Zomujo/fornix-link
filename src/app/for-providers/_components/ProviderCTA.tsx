'use client';
import Link from 'next/link';
import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Stethoscope, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProviderCTA = (): JSX.Element => {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden py-24">
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-800" />

      {/* Decorative mesh blobs */}
      <div className="pointer-events-none absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-5 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-white opacity-5 blur-3xl" />

      {/* Kente-inspired decorative stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 opacity-60" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white">
            Join the Movement
          </span>
          <h2 className="mb-6 text-4xl font-black text-white md:text-5xl lg:text-6xl">
            Ready to transform how you deliver care?
          </h2>
          <p className="mb-10 text-xl text-white/80">
            Join 150+ doctors and 20+ hospitals already using Fornix Link to deliver better care,
            faster — across Ghana.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={() => router.push('/sign-up?role=doctor')}
              className="flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-teal-700 shadow-xl transition-all hover:shadow-2xl hover:brightness-105"
              child={
                <>
                  <Stethoscope className="h-5 w-5" />
                  Join as a Doctor — Free
                  <ArrowRight className="h-4 w-4" />
                </>
              }
            />
            <Link href="/sign-up?role=hospital">
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-full border-white/40 px-8 py-4 text-base font-semibold text-white hover:bg-white/15"
                child={
                  <>
                    <Building2 className="h-5 w-5" />
                    Register Your Hospital
                  </>
                }
              />
            </Link>
          </div>

          <p className="mt-8 text-sm text-white/60">
            Questions?{' '}
            <Link
              href={`mailto:admin@fornixlink.com`}
              className="underline hover:text-white transition-colors"
            >
              Contact our team
            </Link>{' '}
            — we typically respond within 2 hours.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProviderCTA;
