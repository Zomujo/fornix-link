'use client';
import { Search } from 'lucide-react';
import { useEffect, useState, JSX } from 'react';
import styles from './home.module.css';
import { Button } from '@/components/ui/button';
import { MAX_AMOUNT, MIN_AMOUNT, specialties } from '@/constants/constants';
import { IQueryParams } from '@/types/shared.interface';
import { AcceptDeclineStatus } from '@/types/shared.enum';
import { useQueryParam } from '@/hooks/useQueryParam';
import { Combobox } from '@/components/ui/select';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';

const Hero = (): JSX.Element => {
  const [current, setCurrent] = useState(0);
  const [queryParameters, setQueryParameters] = useState<IQueryParams<AcceptDeclineStatus>>();
  const { updateQueries } = useQueryParam();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % specialties.length);
    }, 2200);
    return (): void => clearInterval(interval);
  }, []);

  const handleSearch = (): void => {
    updateQueries({ ...queryParameters, q: 'true' });
  };

  return (
    <section
      className={`relative min-h-screen overflow-hidden pt-[65px] text-white ${styles.heroBackground}`}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Playful floating blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Warm yellow blob — top-right */}
        <div
          className="absolute -top-20 -right-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: '#fbbf24', animation: 'floatBlob1 14s ease-in-out infinite alternate' }}
        />
        {/* Teal blob — bottom-left */}
        <div
          className="absolute -bottom-24 -left-12 h-80 w-80 rounded-full opacity-25 blur-3xl"
          style={{ background: '#14b8a6', animation: 'floatBlob2 11s ease-in-out infinite alternate' }}
        />
        {/* Pink accent — center-right */}
        <div
          className="absolute top-1/3 right-[15%] h-44 w-44 rounded-full opacity-20 blur-2xl"
          style={{ background: '#f472b6', animation: 'floatBlob1 9s ease-in-out infinite alternate-reverse' }}
        />
        {/* Small green dot */}
        <div
          className="absolute bottom-[30%] left-[12%] h-4 w-4 rounded-full bg-emerald-400 opacity-80"
          style={{ animation: 'floatBlob2 5s ease-in-out infinite alternate' }}
        />
        {/* Small yellow dot */}
        <div
          className="absolute top-[25%] right-[28%] h-3 w-3 rounded-full bg-amber-300 opacity-70"
          style={{ animation: 'floatBlob1 4s ease-in-out infinite alternate' }}
        />
        {/* Ring — decorative */}
        <div
          className="absolute top-[18%] left-[8%] h-16 w-16 rounded-full border-2 border-white/20"
          style={{ animation: 'floatBlob2 8s ease-in-out infinite alternate' }}
        />
        <div
          className="absolute bottom-[20%] right-[10%] h-10 w-10 rounded-full border-2 border-amber-300/30"
          style={{ animation: 'floatBlob1 7s ease-in-out infinite alternate-reverse' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4 pb-16">
        <div className="w-full max-w-3xl text-center">
          <h1 className="mb-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
            Connect with the right
            <br />
            <span className="relative inline-block">
              specialist for your needs
              {/* Playful underline scribble */}
              <svg
                viewBox="0 0 300 12"
                className="absolute -bottom-2 left-0 w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 Q75 2 150 8 Q225 14 298 6"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Animated specialty — in a fun colored chip */}
          <div className="mb-8 flex flex-col items-center justify-center gap-3 text-lg text-white/80">
            <span
              key={current}
              className="animate-fadeSpeciality inline-block rounded-full bg-white/20 px-5 py-1.5 text-base font-bold text-white shadow-sm backdrop-blur-md"
            >
              {specialties[current].label}
            </span>
            <p>Quality care made simple — book the right expert for you.</p>
          </div>

          {/* Search card */}
          <div className="relative mx-auto w-full max-w-2xl">
            {/* Fun colored shadow behind the card */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 opacity-40 blur-lg" />

            <div className="relative rounded-2xl bg-white p-5 shadow-xl">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Combobox
                    onChange={(value) =>
                      setQueryParameters((prev) => ({ ...prev, specialty: value }))
                    }
                    label="Specialty"
                    options={specialties}
                    value={queryParameters?.specialty ?? ''}
                    className="px-3 py-4"
                    placeholder="What do you need?"
                    searchPlaceholder="Search specialty..."
                    defaultMaxWidth={false}
                    wrapperClassName="text-left text-[#111] flex-1"
                    showAllOption
                  />
                  <Input
                    type="text"
                    placeholder="Any specific doctor?"
                    className="py-4 text-sm text-slate-800 placeholder:text-slate-400 sm:flex-1"
                    labelName="Doctor"
                    labelClassName="text-left text-sm text-slate-700"
                    value={queryParameters?.search}
                    onChange={(e) =>
                      setQueryParameters((prev) => ({ ...prev, search: e.target.value }))
                    }
                    defaultMaxWidth={false}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-600">Budget</p>
                    <span className="text-primary text-sm font-semibold">
                      {queryParameters?.priceMax
                        ? `GHS ${Number(queryParameters.priceMax).toLocaleString()}`
                        : 'Any'}
                    </span>
                  </div>
                  <Slider
                    value={[Number(queryParameters?.priceMax)]}
                    onValueChange={(value) =>
                      setQueryParameters((prev) => ({ ...prev, priceMax: String(value[0]) }))
                    }
                    min={MIN_AMOUNT}
                    max={MAX_AMOUNT}
                    step={10}
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  className="bg-primary hover:bg-primary/90 w-full rounded-xl py-5 text-sm font-semibold text-white"
                  child={
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Book a doctor
                    </>
                  }
                />
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-white/40">
            150+ verified doctors &nbsp;·&nbsp; Same-day booking &nbsp;·&nbsp; Across Ghana
          </p>
        </div>
      </div>

      {/* Wavy bottom edge instead of a hard cut */}
      <div className="absolute right-0 bottom-0 left-0 z-20">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full">
          <path d="M0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
