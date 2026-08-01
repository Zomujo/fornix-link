'use client';
import { Search, CheckCircle2 } from 'lucide-react';
import { useEffect, useState, JSX } from 'react';
import { useRouter } from 'next/navigation';
import styles from './home.module.css';
import { Button } from '@/components/ui/button';
import { specialties } from '@/constants/constants';
import { Combobox } from '@/components/ui/select';
import { Input } from '../ui/input';

type SearchMode = 'doctors' | 'hospitals';

const LOCATIONS = [
  { value: 'accra', label: 'Accra' },
  { value: 'kumasi', label: 'Kumasi' },
  { value: 'tamale', label: 'Tamale' },
  { value: 'takoradi', label: 'Takoradi' },
  { value: 'cape-coast', label: 'Cape Coast' },
  { value: 'tema', label: 'Tema' },
];

const getSpecialtyLabel = (value: string): string =>
  specialties.find((specialty) => specialty.value === value)?.label ?? value;

const Hero = (): JSX.Element => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [searchMode, setSearchMode] = useState<SearchMode>('doctors');
  const [doctorQuery, setDoctorQuery] = useState({ search: '', specialty: '' });
  const [hospitalQuery, setHospitalQuery] = useState({ search: '', city: '' });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % specialties.length);
    }, 2200);
    return (): void => clearInterval(interval);
  }, []);

  const handleSearch = (): void => {
    const query = new URLSearchParams();

    if (searchMode === 'doctors') {
      if (doctorQuery.search.trim()) {
        query.set('search', doctorQuery.search.trim());
      }

      if (doctorQuery.specialty) {
        query.set('specialty', getSpecialtyLabel(doctorQuery.specialty));
      }

      router.push(`/find-doctors${query.size ? `?${query.toString()}` : ''}`);
      return;
    }

    if (hospitalQuery.search.trim()) {
      query.set('search', hospitalQuery.search.trim());
    }

    if (hospitalQuery.city) {
      query.set('city', hospitalQuery.city);
    }

    router.push(`/hospitals${query.size ? `?${query.toString()}` : ''}`);
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
        <div className="w-full max-w-4xl text-center">
          <h1 className="mb-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
            Find care. Book instantly.
            <br />
            <span className="relative inline-block">
              Get seen today.
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
              {specialties[current]?.label || 'General Checkup'}
            </span>
            <p>Doctors and hospitals across Ghana, on any device, no download required.</p>
          </div>

          {/* Search card */}
          <div className="relative mx-auto w-full max-w-4xl">
            {/* Fun colored shadow behind the card */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 opacity-40 blur-lg" />

            <div className="relative rounded-2xl bg-white p-3 shadow-xl">
              <div className="mb-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={searchMode === 'doctors' ? 'default' : 'outline'}
                  className={searchMode === 'doctors' ? 'rounded-full px-5' : 'rounded-full px-5 text-slate-700'}
                  onClick={() => setSearchMode('doctors')}
                  child="Doctors"
                />
                <Button
                  type="button"
                  variant={searchMode === 'hospitals' ? 'default' : 'outline'}
                  className={
                    searchMode === 'hospitals'
                      ? 'rounded-full px-5'
                      : 'rounded-full px-5 text-slate-700'
                  }
                  onClick={() => setSearchMode('hospitals')}
                  child="Hospitals"
                />
              </div>

              {searchMode === 'doctors' ? (
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="md:min-w-0 md:flex-[1.25]">
                    <Combobox
                      onChange={(value) =>
                        setDoctorQuery((prev) => ({ ...prev, specialty: value }))
                      }
                      options={specialties}
                      value={doctorQuery.specialty}
                      placeholder="What specialty do you need?"
                      searchPlaceholder="Search specialty..."
                      className="h-14 rounded-xl border-none bg-slate-50 text-left text-slate-900 shadow-none"
                      wrapperClassName="w-full"
                      showAllOption
                    />
                  </div>

                  <div className="hidden md:block h-10 w-px bg-slate-200"></div>

                  <div className="relative md:min-w-0 md:flex-1">
                    <Input
                      type="text"
                      placeholder="Optional: Doctor's name"
                      className="h-14 rounded-xl border-none bg-slate-50 py-4 pl-10 text-base text-slate-900 shadow-none focus-visible:ring-0"
                      value={doctorQuery.search}
                      onChange={(event) =>
                        setDoctorQuery((prev) => ({ ...prev, search: event.target.value }))
                      }
                      defaultMaxWidth={false}
                    />
                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </div>

                  <Button
                    onClick={handleSearch}
                    className="bg-primary hover:bg-primary/90 h-14 shrink-0 rounded-xl px-8 text-base font-semibold text-white"
                    child="Search"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Hospital name, service, or location"
                      className="h-14 rounded-xl border-none bg-slate-50 py-4 pl-10 text-base text-slate-900 shadow-none focus-visible:ring-0"
                      value={hospitalQuery.search}
                      onChange={(event) =>
                        setHospitalQuery((prev) => ({ ...prev, search: event.target.value }))
                      }
                      defaultMaxWidth={false}
                    />
                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </div>

                  <div className="hidden md:block h-10 w-px bg-slate-200"></div>

                  <div className="md:w-52">
                    <Combobox
                      onChange={(value) =>
                        setHospitalQuery((prev) => ({ ...prev, city: value }))
                      }
                      options={LOCATIONS}
                      value={hospitalQuery.city}
                      placeholder="Any city"
                      searchPlaceholder="Search city..."
                      className="h-14 rounded-xl border-none bg-slate-50 text-slate-900 shadow-none"
                      wrapperClassName="w-full"
                      showAllOption
                    />
                  </div>

                  <Button
                    onClick={handleSearch}
                    className="bg-primary hover:bg-primary/90 h-14 shrink-0 rounded-xl px-8 text-base font-semibold text-white"
                    child="Search"
                  />
                </div>
              )}

              <p className="mt-3 text-left text-sm text-slate-500">
                {searchMode === 'doctors'
                  ? 'Start with the specialty you need. Doctor name is optional.'
                  : 'Hospital search supports name, city, and hospital-related services.'}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-sm md:text-base text-white/90 font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-400" /> Free to search. No account needed. Cancel most bookings free of charge.
            </p>
            
            <p className="text-xs md:text-sm text-white/50 font-medium">
              Ghana Medical and Dental Council verified providers &nbsp;·&nbsp; 500+ appointments booked &nbsp;·&nbsp; Real patient reviews
            </p>
          </div>
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
